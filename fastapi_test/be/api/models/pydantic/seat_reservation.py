from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr

class SeatReservationCreate(BaseModel):
    reserve_id: Optional[int] = None
    todo_content: Optional[str] = None
    person_id: Optional[int] = None
    seat_id: Optional[int] = None
    start_time: datetime | None = None
    finish_time: datetime | None = None
    reserve_day: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

class SeatReservationUpdate(BaseModel):
    reserve_id: Optional[int] = None
    todo_content: Optional[str] = None
    person_id: Optional[int] = None
    seat_id: Optional[int] = None
    start_time: datetime | None = None
    finish_time: datetime | None = None
    reserve_day: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

class SeatReservationResponse(BaseModel):
    id: int
    reserve_id: Optional[int] = None
    todo_content: Optional[str] = None
    person_id: Optional[int] = None
    person_name: Optional[str] = None  # person_nameを追加
    seat_id: Optional[int] = None
    seat_name: Optional[str] = None  # seat_nameを追加
    start_time: datetime | None = None
    finish_time: datetime | None = None
    reserve_day: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

