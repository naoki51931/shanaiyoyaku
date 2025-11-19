# models/sqlalchemy/tag.py
from sqlalchemy import Column, Integer, String, DateTime, func
from database.database import Base
from sqlalchemy.orm import relationship
from models.sqlalchemy.pasokon_tags import pasokon_tags  # 中間テーブルPasokonTagのインポート


class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # PasokonTag 中間テーブルとの関連を定義
    pasokons = relationship("Pasokon", secondary=pasokon_tags, back_populates="tags")
    pasokons = relationship("Pasokon", secondary="pasokon_tags", back_populates="tags")
