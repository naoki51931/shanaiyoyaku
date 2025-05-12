from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from database.database import get_db
from models.sqlalchemy.seat_reservation import SeatReservation as DBSeatReservation
from models.pydantic.seat_reservation import (
    SeatReservationCreate,
    SeatReservationUpdate,
    SeatReservationResponse
)

router = APIRouter()

@router.get("/seat_reservation/all/", response_model=list[SeatReservationResponse])
def get_all_reservations(db: Session = Depends(get_db)):
    try:
        reservations = db.query(DBSeatReservation).options(
            joinedload(DBSeatReservation.user),
            joinedload(DBSeatReservation.seat_regist)
        ).all()
        return reservations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/seat_reservation/{reservation_id}", response_model=SeatReservationResponse)
def get_reservation_by_id(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(DBSeatReservation).filter(DBSeatReservation.id == reservation_id).first()
    if reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation

@router.post("/seat_reservation/new/", response_model=SeatReservationResponse)
def create_reservation(reservation: SeatReservationCreate, db: Session = Depends(get_db)):
    try:
        db_reservation = DBSeatReservation(**reservation.dict())
        db.add(db_reservation)
        db.commit()
        db.refresh(db_reservation)
        return db_reservation
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Reservation ID already exists")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/seat_reservation/{reservation_id}", response_model=SeatReservationResponse)
def update_reservation(reservation_id: int, reservation_update: SeatReservationUpdate, db: Session = Depends(get_db)):
    db_reservation = db.query(DBSeatReservation).filter(DBSeatReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")

    for key, value in reservation_update.dict(exclude_unset=True).items():
        setattr(db_reservation, key, value)

    try:
        db.commit()
        db.refresh(db_reservation)
        return db_reservation
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/seat_reservation/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = db.query(DBSeatReservation).filter(DBSeatReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    db.delete(db_reservation)
    db.commit()