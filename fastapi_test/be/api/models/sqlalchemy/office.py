from sqlalchemy import Boolean, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from database.database import Base

class Office(Base):
    __tablename__ = "office"
    __table_args__ = {"extend_existing": True}  # これを追加

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    office_name = Column(String(30), unique=True, nullable=False)
    office_id = Column(String(30), unique=True, nullable=False)
    children = relationship("SeatRegist", backref="parent")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)