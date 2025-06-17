from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr

class TagBase(BaseModel):
    name: str

class PasokonCreate(BaseModel):
    pasokon_name: Optional[str] = None
    in_active: Optional[int] = None
    soft_id: List[TagBase]
    office_id: Optional[str] = None
    seat_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PasokonUpdate(BaseModel):
    pasokon_name: Optional[str] = None
    in_active: Optional[int] = None
    soft_id: List[TagBase]
    office_id: Optional[str] = None
    seat_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PasokonResponse(BaseModel):
    id: int
    pasokon_name: Optional[str] = None
    in_active: Optional[int] = None
    soft_id: List[TagBase]
    office_id: Optional[int] = None
    seat_id: Optional[int] = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
