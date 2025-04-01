from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr

class SeatRegistCreate(BaseModel):
    seat_name: Optional[str] = None
    office_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class SeatRegistUpdate(BaseModel):
    seat_name: Optional[str] = None
    office_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class SeatRegistResponse(BaseModel):
    id: int
    seat_name: Optional[str] = None
    office_id: Optional[str] = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

