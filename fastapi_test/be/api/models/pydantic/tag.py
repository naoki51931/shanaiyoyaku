from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class TagCreate(BaseModel):
    name: Optional[str] = None  # タグ名など、必要なフィールドをここに追加

    model_config = ConfigDict(from_attributes=True)

class TagUpdate(BaseModel):
    name: Optional[str] = None  # タグ名を更新するフィールド

    model_config = ConfigDict(from_attributes=True)

class TagResponse(BaseModel):
    id: int
    name: Optional[str] = None  # タグ名など、レスポンスに含めるフィールドを追加
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
