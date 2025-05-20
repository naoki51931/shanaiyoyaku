from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from database.database import Base
from models.sqlalchemy.office import Office as DBOffice
from models.sqlalchemy.seat_reservation import SeatReservation



class SeatRegist(Base):
    __tablename__ = "seat_regist" # これを追加

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    seat_name = Column(String(30), unique=True, nullable=False)
    office_id = Column(Integer,  ForeignKey("office.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

     # Office とのリレーション
    office = relationship("Office", back_populates="seats")

     # seat_reservation とのリレーション
    seat_reserve_id = relationship("SeatReservation", back_populates="seat_regist")

    # Pasokonとのリレーションを定義
    pasokon_seats = relationship("Pasokon", back_populates="seat_in_pasokon")