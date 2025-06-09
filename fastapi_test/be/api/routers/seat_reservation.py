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

import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/seat_reservation/all/", response_model=list[SeatReservationResponse])
def get_all_reservations(db: Session = Depends(get_db)):
    try:
        reservations = db.query(DBSeatReservation).options(
            joinedload(DBSeatReservation.user),
            joinedload(DBSeatReservation.seat_regist)
        ).all()
        
        response = []
        for reservation in reservations:
            response.append({
                "id": reservation.id,
                "reserve_id": reservation.reserve_id,
                "todo_content": reservation.todo_content,
                "person_id": reservation.person_id,
                "person_name": reservation.user.kanji_name if reservation.user else "不明",  # ユーザーが存在しない場合にデフォルト値
                "seat_id": reservation.seat_id,
                "seat_name": reservation.seat_regist.seat_name if reservation.seat_regist else "不明",  # 座席が存在しない場合にデフォルト値
                "start_time": reservation.start_time,
                "finish_time": reservation.finish_time,
                "reserve_day": reservation.reserve_day,
                "created_at": reservation.created_at,
                "updated_at": reservation.updated_at,
            })
        
        return response
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")  # エラーメッセージをログに出力
        raise HTTPException(status_code=500, detail="内部サーバーエラーが発生しました")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")  # その他のエラーもログに出力
        raise HTTPException(status_code=500, detail="予期しないエラーが発生しました")

@router.get("/seat_reservation/{reservation_id}", response_model=SeatReservationResponse)
def get_reservation_by_id(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(DBSeatReservation).filter(DBSeatReservation.id == reservation_id).first()
    if reservation is None:
        raise HTTPException(status_code=404, detail="予約が見つかりません")
    return reservation

@router.post("/seat_reservation/new/", response_model=SeatReservationResponse)
def create_reservation(reservation: SeatReservationCreate, db: Session = Depends(get_db)):
    overlapping_reservation = db.query(DBSeatReservation).filter(
        DBSeatReservation.finish_time > reservation.start_time,
        DBSeatReservation.start_time < reservation.finish_time
    ).first()

    if overlapping_reservation:
        raise HTTPException(status_code=400, detail="すでに座席予約がされています")
    
    try:
        db_reservation = DBSeatReservation(**reservation.dict())
        db.add(db_reservation)
        db.commit()
        db.refresh(db_reservation)
        return db_reservation
    except IntegrityError as e:
        db.rollback()  # 必ずロールバックする
        raise HTTPException(status_code=400, detail="予約IDが既に存在しています")
    except SQLAlchemyError as e:
        db.rollback()  # 必ずロールバックする
        raise HTTPException(status_code=400, detail=f"データベースエラー: {str(e)}")

@router.put("/seat_reservation/{reservation_id}", response_model=SeatReservationResponse)
def update_reservation(reservation_id: int, reservation_update: SeatReservationUpdate, db: Session = Depends(get_db)):
    db_reservation = db.query(DBSeatReservation).filter(DBSeatReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="予約が見つかりません")
    
    # 変更されたデータを更新
    for key, value in reservation_update.dict(exclude_unset=True).items():
        setattr(db_reservation, key, value)

    # 更新後の値を使用して重複する予約がないか確認
    updated_start = db_reservation.start_time
    updated_end = db_reservation.finish_time
    
    overlapping_reservation = db.query(DBSeatReservation).filter(
        DBSeatReservation.id != reservation_id,
        DBSeatReservation.finish_time > updated_start,
        DBSeatReservation.start_time < updated_end
    ).first()

    if overlapping_reservation:
        raise HTTPException(status_code=400, detail="すでに座席予約がされています")

    try:
        db.commit()  # データベースをコミット
        db.refresh(db_reservation)  # 更新されたオブジェクトを再取得
        return db_reservation  # 更新された予約情報を返す
    except SQLAlchemyError as e:
        db.rollback()  # 何か問題があればロールバック
        raise HTTPException(status_code=400, detail=f"データベースエラー: {str(e)}")

@router.delete("/seat_reservation/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = db.query(DBSeatReservation).filter(DBSeatReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="予約が見つかりません")
    
    db.delete(db_reservation)
    db.commit()
