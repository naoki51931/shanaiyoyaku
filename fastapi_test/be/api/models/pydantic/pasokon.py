from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr

class PasokonCreate(BaseModel):
    pasokon_name: Optional[str] = None
    in_active: Optional[int] = None
    soft_names: list[str] = []   # ← 名前だけ受け取り
    office_id: Optional[int] = None
    seat_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class PasokonUpdate(BaseModel):
    pasokon_name: Optional[str] = None
    in_active: Optional[int] = None
    soft_ids: List[int] = []  # 空リストをデフォルト値として設定
    office_id: Optional[int] = None
    seat_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class PasokonResponse(BaseModel):
    id: int
    pasokon_name: Optional[str] = None
    in_active: Optional[int] = None
    soft_ids: List[int] = []  # 空リストをデフォルト値として設定
    soft_names: List[str] = []  # 空リストをデフォルト値として設定
    office_id: Optional[int] = None
    seat_id: Optional[int] = None
    created_at: Optional[datetime] = None  # 型の統一
    updated_at: Optional[datetime] = None  # 型の統一

    model_config = ConfigDict(from_attributes=True)
