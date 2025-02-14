from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr

class UserCreate(BaseModel):
    password: Optional[str] = None
    kanji_name: Optional[str] = None
    kata_name: Optional[str] = None
    position: Optional[str] = None
    is_superuser: Optional[bool] = None
    is_approval: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    password: Optional[str] = None
    kanji_name: Optional[str] = None
    kata_name: Optional[str] = None
    position: Optional[str] = None
    is_superuser: Optional[bool] = None
    is_approval: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: int
    password: Optional[str] = None
    kanji_name: Optional[str] = None
    kata_name: Optional[str] = None
    position: Optional[str] = None
    is_superuser: Optional[bool] = None
    is_approval: Optional[int] = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

