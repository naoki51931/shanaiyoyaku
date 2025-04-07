from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr

class OfficeCreate(BaseModel):
    office_name: Optional[str] = None
    office_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class OfficeUpdate(BaseModel):
    office_name: Optional[str] = None
    office_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class OfficeResponse(BaseModel):
    id: int
    office_name: Optional[str] = None
    office_id: Optional[str] = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

