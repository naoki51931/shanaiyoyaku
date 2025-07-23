from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship
from database.database import Base
from models.sqlalchemy.pasokon import Pasokon


class SeatReservation(Base):
    __tablename__ = "seat_reservation" # これを追加

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    reserve_id = Column(Integer, unique=True, nullable=False)
    todo_content = Column(Text, nullable=True)
    person_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    office_id = Column(Integer, ForeignKey("office.id"), nullable=False)
    seat_id = Column(Integer, ForeignKey("seat_regist.id"), nullable=False)
    pasokon_id = Column(Integer, ForeignKey("pasokon.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    finish_time = Column(DateTime(timezone=True), nullable=False)
    reserve_day = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

     # User とのリレーション
    user = relationship("User", back_populates="seat_reserve_member")

     # SeatRegist とのリレーション
    seat_regist = relationship("SeatRegist", back_populates="seat_reserve_id")

    # Office とのリレーション
    office = relationship("Office", back_populates="seat_reservations")

    # Pasokon とのリレーション
    pasokon_reserve = relationship(
        "Pasokon",
        back_populates="seat_reserve_pasokon"   # ← 1 つだけ書く
        # overlaps="pasokon_tags"  # *必要なら* overlaps を追加
    )