from sqlalchemy import Boolean, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from database.database import Base

class Pasokon(Base):
    __tablename__ = "pasokon" # これを追加

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pasokon_name = Column(String(30), unique=True, nullable=False)
    pasokon_id = Column(String(30), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)