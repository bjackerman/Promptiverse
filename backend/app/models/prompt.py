from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from bson import ObjectId
from .style_profile import PyObjectId

class PromptModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str
    description: Optional[str] = ""
    modal_type: Literal["text", "image", "video", "code", "audio", "other"]
    content: Dict[str, Any]
    style_profile_id: Optional[str] = None
    tags: List[str] = []
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class PromptCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    modal_type: Literal["text", "image", "video", "code", "audio", "other"]
    content: Dict[str, Any]
    style_profile_id: Optional[str] = None
    tags: List[str] = []
    metadata: Dict[str, Any] = {}
