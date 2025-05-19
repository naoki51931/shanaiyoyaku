from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr

class PasokonCreate(BaseModel):
    pasokon_name: Optional[str] = None
    office_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PasokonUpdate(BaseModel):
    pasokon_name: Optional[str] = None
    office_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PasokonResponse(BaseModel):
    id: int
    pasokon_name: Optional[str] = None
    office_id: Optional[str] = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

