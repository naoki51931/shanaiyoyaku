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
        # 必要に応じて、person_name と seat_name を SeatReservationResponse 形式で追加
        response = []
        for reservation in reservations:
            response.append({
                "id": reservation.id,
                "reserve_id": reservation.reserve_id,
                "todo_content": reservation.todo_content,
                "person_id": reservation.person_id,
                "person_name": reservation.user.kanji_name,  # ユーザーの名前
                "seat_id": reservation.seat_id,
                "seat_name": reservation.seat_regist.seat_name,  # 座席の名前
                "start_time": reservation.start_time,
                "finish_time": reservation.finish_time,
                "reserve_day": reservation.reserve_day,
                "created_at": reservation.created_at,
                "updated_at": reservation.updated_at,
            })
        
        return response
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
    overlapping_reservation = db.query(DBSeatReservation).filter(
        DBSeatReservation.finish_time > reservation.start_time,
        DBSeatReservation.start_time < reservation.finish_time
    ).first()

    if overlapping_reservation:
        db.rollback()
        raise HTTPException(status_code=400, detail="すでに座席予約がされています")
    
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
        db.rollback()
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    # 更新後の値を一時的に仮適用（元の値をベースに未指定フィールドは維持）
    updated_data = db_reservation.__dict__.copy()
    updated_data.update(reservation_update.dict(exclude_unset=True))

    updated_start = updated_data.get("start_time")
    updated_end = updated_data.get("finish_time")
    updated_seat_id = updated_data.get("reserve_id")

    # 自分以外の同じ座席IDで期間が重なっている予約を探す
    overlapping_reservation = db.query(DBSeatReservation).filter(
        DBSeatReservation.id != reservation_id,
        DBSeatReservation.finish_time > updated_start,
        DBSeatReservation.start_time < updated_end
    ).first()

    if overlapping_reservation:
        raise HTTPException(status_code=400, detail="すでに座席予約がされています")

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