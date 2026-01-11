from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
from typing_extensions import Annotated
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, values=None, **kwargs):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema

class StyleProfileModel(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    schema_version: str = "1.0.0"
    name: str
    description: Optional[str] = ""
    tags: List[str] = []
    style: Dict[str, Any]
    intent: Optional[Dict[str, Any]] = None
    negative: Optional[Dict[str, Any]] = None
    usage_count: int = 0
    is_template: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "name": "Neo-Noir Cinematic",
                "schema_version": "1.0.0",
                "style": {}
            }
        }
    )

class StyleProfileCreate(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = ""
    tags: List[str] = []
    style: Dict[str, Any]
    intent: Optional[Dict[str, Any]] = None
    negative: Optional[Dict[str, Any]] = None
    is_template: bool = False
