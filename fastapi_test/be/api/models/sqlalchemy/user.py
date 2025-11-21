from sqlalchemy import Boolean, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from database.database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_name = Column(String(30), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    kanji_name = Column(String(30), nullable=False)
    kata_name = Column(String(30), nullable=False)
    position = Column(String(20), nullable=False)
    author = Column(String(30), nullable=True)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_approval = Column(Integer, default=1, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    seat_reserve_member = relationship("SeatReservation", back_populates="user")
