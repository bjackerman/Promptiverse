from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from ..models.style_profile import StyleProfileModel, StyleProfileCreate
from ..database import get_database
from bson import ObjectId
import json
import os
import jsonschema

router = APIRouter()

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "..", "schemas", "image-style-profile.schema.json")
with open(SCHEMA_PATH, "r") as f:
    STYLE_SCHEMA = json.load(f)

@router.get("/", response_model=List[StyleProfileModel])
async def list_styles(
    search: Optional[str] = None,
    tags: Optional[List[str]] = Query(None),
    limit: int = 50,
    skip: int = 0
):
    db = await get_database()
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    if tags:
        query["tags"] = {"$in": tags}
    
    cursor = db["style_profiles"].find(query).skip(skip).limit(limit)
    styles = await cursor.to_list(length=limit)
    return styles

@router.post("/", response_model=StyleProfileModel)
async def create_style(style: StyleProfileCreate):
    db = await get_database()
    
    # Validate against JSON schema
    try:
        jsonschema.validate(instance=style.style, schema=STYLE_SCHEMA)
    except jsonschema.ValidationError as e:
        raise HTTPException(status_code=422, detail=f"Style JSON invalid: {e.message}")

    style_dict = style.model_dump(exclude={"id"})
    
    # Check if ID exists if provided (though user typically won't provide _id on creation unless it's a specific string ID scenario)
    if style.id:
         style_dict["_id"] = style.id

    new_style = await db["style_profiles"].insert_one(style_dict)
    created_style = await db["style_profiles"].find_one({"_id": new_style.inserted_id})
    return created_style

@router.get("/{id}", response_model=StyleProfileModel)
async def get_style(id: str):
    db = await get_database()
    style = await db["style_profiles"].find_one({"_id": id})
    if not style:
         # Try ObjectId if string lookup fails
        if ObjectId.is_valid(id):
             style = await db["style_profiles"].find_one({"_id": ObjectId(id)})
    
    if not style:
        raise HTTPException(status_code=404, detail="Style not found")
    return style

@router.put("/{id}", response_model=StyleProfileModel)
async def update_style(id: str, style: StyleProfileCreate):
    db = await get_database()
    
    # Validate against JSON schema
    try:
        jsonschema.validate(instance=style.style, schema=STYLE_SCHEMA)
    except jsonschema.ValidationError as e:
        raise HTTPException(status_code=422, detail=f"Style JSON invalid: {e.message}")

    update_data = style.model_dump(exclude={"id"})
    update_data["updated_at"] = datetime.utcnow() # Note: datetime needs import

    result = await db["style_profiles"].update_one(
        {"_id": id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        # Try ObjectId
         if ObjectId.is_valid(id):
             result = await db["style_profiles"].update_one(
                {"_id": ObjectId(id)}, 
                {"$set": update_data}
             )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Style not found")
        
    updated_style = await db["style_profiles"].find_one({"_id": id})
    if not updated_style and ObjectId.is_valid(id):
        updated_style = await db["style_profiles"].find_one({"_id": ObjectId(id)})
        
    return updated_style

@router.delete("/{id}")
async def delete_style(id: str):
    db = await get_database()
    result = await db["style_profiles"].delete_one({"_id": id})
    
    if result.deleted_count == 0:
         if ObjectId.is_valid(id):
             result = await db["style_profiles"].delete_one({"_id": ObjectId(id)})
             
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Style not found")
    return {"message": "Style deleted successfully"}

@router.post("/validate")
async def validate_style(style_json: dict = Body(...)):
    try:
        jsonschema.validate(instance=style_json, schema=STYLE_SCHEMA)
        return {"valid": True, "errors": []}
    except jsonschema.ValidationError as e:
        return {"valid": False, "errors": [e.message]}

# Fix missing imports
from datetime import datetime
