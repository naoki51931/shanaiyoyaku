from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from database.database import Base

class SeatRegist(Base):
    __tablename__ = "seat_regist"
    __table_args__ = {"extend_existing": True}  # これを追加

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    seat_name = Column(String(30), unique=True, nullable=False)
    office_id = Column(Integer,  ForeignKey("office.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)