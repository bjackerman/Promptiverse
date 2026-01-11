from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.prompt import PromptModel, PromptCreate
from ..database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[PromptModel])
async def list_prompts(
    modal_type: Optional[str] = None,
    tags: Optional[List[str]] = Query(None),
    limit: int = 20,
    skip: int = 0
):
    db = await get_database()
    query = {}
    if modal_type:
        query["modal_type"] = modal_type
    if tags:
        query["tags"] = {"$in": tags}
    
    cursor = db["prompts"].find(query).skip(skip).limit(limit).sort("created_at", -1)
    prompts = await cursor.to_list(length=limit)
    return prompts

@router.post("/", response_model=PromptModel)
async def create_prompt(prompt: PromptCreate):
    db = await get_database()
    prompt_dict = prompt.model_dump()
    new_prompt = await db["prompts"].insert_one(prompt_dict)
    created_prompt = await db["prompts"].find_one({"_id": new_prompt.inserted_id})
    return created_prompt

@router.get("/{id}", response_model=PromptModel)
async def get_prompt(id: str):
    db = await get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    prompt = await db["prompts"].find_one({"_id": ObjectId(id)})
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt

@router.put("/{id}", response_model=PromptModel)
async def update_prompt(id: str, prompt: PromptCreate):
    db = await get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    update_data = prompt.model_dump()
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db["prompts"].update_one(
        {"_id": ObjectId(id)}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Prompt not found")
        
    updated_prompt = await db["prompts"].find_one({"_id": ObjectId(id)})
    return updated_prompt

@router.delete("/{id}")
async def delete_prompt(id: str):
    db = await get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db["prompts"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return {"message": "Prompt deleted successfully"}
