import datetime

from sqlalchemy import Boolean, DateTime, Column, Integer, String, func
from pydantic import BaseModel
from pydantic import ConfigDict
from db import Base
from db import ENGINE



# テーブル定義
class UserTable(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, autoincrement=True)
    password = Column(String(30), nullable=False)
    kanji_name = Column(String(30), nullable=False)
    kata_name = Column(String(30), nullable=False)
    position = Column(String(20), nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_approval = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, onupdate=func.now())

# モデル定義
class User(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: int
    password: str
    kanji_name: str
    kata_name: str
    position: str
    is_superuser: bool
    is_approval: int

def main():
    # テーブル構築
    Base.metadata.create_all(bind=ENGINE)


if __name__ == "__main__":
    main()