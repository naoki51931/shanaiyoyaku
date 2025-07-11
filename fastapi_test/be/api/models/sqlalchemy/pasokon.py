from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship
from database.database import Base
from models.sqlalchemy.pasokon_tags import pasokon_tags  # 中間テーブルをインポート
from models.sqlalchemy.tag import Tag  # Tagクラスのインポート
from sqlalchemy.ext.hybrid import hybrid_property

class Pasokon(Base):
    __tablename__ = "pasokon"  # これを追加

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pasokon_name = Column(String(30), unique=True, nullable=False)
    in_active = Column(Integer, nullable=True)
    office_id = Column(Integer, ForeignKey("office.id"), nullable=False)
    seat_id = Column(Integer,  ForeignKey("seat_regist.id"), nullable=False)
    performance = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Office とのリレーション
    office_in_pasokon = relationship("Office", back_populates="pasokon_in_office")
    seat_in_pasokon = relationship("SeatRegist", back_populates="pasokon_seats")

    # タグとのリレーションシップを定義
    tags = relationship("Tag", secondary="pasokon_tags", back_populates="pasokons")  # Pasokon と Tag の多対多リレーション
    
    seat_reserve_pasokon = relationship(
        "SeatReservation",
        back_populates="pasokon_reserve",
        cascade="all, delete-orphan"
    )


    @hybrid_property
    def soft_ids(self):
        return [tag.id for tag in self.tags]

    @hybrid_property
    def soft_names(self):
        return [tag.name for tag in self.tags]