from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class PasokonCreate(BaseModel):
    pasokon_id: Optional[str] = None
    pasokon_name: Optional[str] = None
    in_active: Optional[int] = None
    soft_names: list[str] = []   # 名前だけ受け取り
    office_id: Optional[int] = None
    seat_id: Optional[int] = None
    performance: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PasokonUpdate(BaseModel):
    pasokon_id: Optional[str] = None
    pasokon_name: Optional[str] = None
    in_active: Optional[int] = None
    soft_ids: List[int] = []
    office_id: Optional[int] = None
    seat_id: Optional[int] = None
    performance: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PasokonResponse(BaseModel):
    id: int
    pasokon_id: Optional[str] = None
    pasokon_name: Optional[str] = None
    in_active: Optional[int] = None
    soft_ids: List[int] = []
    soft_names: List[str] = []
    office_id: Optional[int] = None
    office_name: Optional[str] = None
    seat_id: Optional[int] = None
    seat_name: Optional[str] = None
    performance: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
