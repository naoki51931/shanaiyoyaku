from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from database.database import Base
from models.sqlalchemy.pasokon_tags import PasokonTag  # 中間テーブルをインポート
from models.sqlalchemy.tags import Tag  # Tagクラスのインポート


class Pasokon(Base):
    __tablename__ = "pasokon" # これを追加

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pasokon_name = Column(String(30), unique=True, nullable=False)
    in_active = Column(Integer, nullable=True)
    soft_id = Column(Integer, ForeignKey("tags.id"), nullable=False)
    office_id = Column(Integer, ForeignKey("office.id"), nullable=False)
    seat_id = Column(Integer,  ForeignKey("seat_regist.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Office とのリレーション
    office_in_pasokon = relationship("Office", back_populates="pasokon_in_office")
    seat_in_pasokon = relationship("SeatRegist", back_populates="pasokon_seats")
    # タグとのリレーションシップを定義
    pasokon_tags = relationship("PasokonTag", back_populates="pasokon")
    tags = relationship("Tag", secondary=PasokonTag.__tablename__, back_populates="pasokons")
