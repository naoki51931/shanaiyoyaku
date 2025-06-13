# models/sqlalchemy/tag.py
from sqlalchemy import Column, Integer, String
from database.database import Base
from sqlalchemy.orm import relationship
from models.sqlalchemy.pasokon_tags import PasokonTag  # 中間テーブルPasokonTagのインポート


class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    # PasokonTag 中間テーブルとの関連を定義
    pasokon_tags = relationship("PasokonTag", back_populates="tag")
    pasokons = relationship("Pasokon", secondary=PasokonTag.__tablename__, back_populates="tags")