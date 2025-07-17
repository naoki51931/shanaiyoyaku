from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from apscheduler.triggers.date import DateTrigger
from utils.utils import change_pasokon_status  # 状態変更関数
from scheduler_config import scheduler
from apscheduler.triggers.date import DateTrigger
from fastapi import APIRouter
from fastapi import Query
from datetime import datetime
from zoneinfo import ZoneInfo  # Python 3.9 以上対応
from pytz import timezone

from database.database import get_db
from models.sqlalchemy.seat_reservation import SeatReservation as DBSeatReservation
from models.pydantic.seat_reservation import (
    SeatReservationCreate,
    SeatReservationUpdate,
    SeatReservationResponse
)

import logging

from pydantic import BaseModel
from typing import Optional, List
from models.sqlalchemy.user import User as DBUser
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class SearchCondition(BaseModel):
    reserve_id: Optional[str] = None
    person_name: Optional[str] = None
    todo_content: Optional[str] = None

@router.post("/seat_reservation/search/", response_model=List[SeatReservationResponse])
def search_reservations(
    cond: SearchCondition,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(DBSeatReservation).join(DBSeatReservation.user)

        if cond.reserve_id:
            query = query.filter(DBSeatReservation.reserve_id.contains(cond.reserve_id))
        if cond.person_name:
            query = query.filter(DBSeatReservation.user.has(DBUser.kanji_name.contains(cond.person_name)))
        if cond.todo_content:
            query = query.filter(DBSeatReservation.todo_content.contains(cond.todo_content))

        results = query.options(
            joinedload(DBSeatReservation.user),
            joinedload(DBSeatReservation.office),
            joinedload(DBSeatReservation.seat_regist),
            joinedload(DBSeatReservation.pasokon_reserve)
        ).all()

        response = []
        for reservation in results:
            response.append({
                "id": reservation.id,
                "reserve_id": reservation.reserve_id,
                "todo_content": reservation.todo_content,
                "person_id": reservation.person_id,
                "person_name": reservation.user.kanji_name if reservation.user else "不明",
                "office_id": reservation.office_id,
                "office_name": reservation.office.office_name if reservation.office else "不明",
                "seat_id": reservation.seat_id,
                "seat_name": reservation.seat_regist.seat_name if reservation.seat_regist else "不明",
                "pasokon_id": reservation.pasokon_id,
                "pasokon_name": reservation.pasokon_reserve.pasokon_name if reservation.pasokon_reserve else "不明",
                "start_time": reservation.start_time,
                "finish_time": reservation.finish_time,
                "reserve_day": reservation.reserve_day,
                "created_at": reservation.created_at,
                "updated_at": reservation.updated_at,
            })

        return response

    except SQLAlchemyError as e:
        logger.error(f"検索中のDBエラー: {str(e)}")
        raise HTTPException(status_code=500, detail="検索時にデータベースエラーが発生しました")

@router.get("/seat_reservation/all/", response_model=list[SeatReservationResponse])
def get_all_reservations(db: Session = Depends(get_db)):
    try:
        reservations = db.query(DBSeatReservation).options(
            joinedload(DBSeatReservation.user),
            joinedload(DBSeatReservation.office),
            joinedload(DBSeatReservation.seat_regist),
            joinedload(DBSeatReservation.pasokon_reserve)
        ).all()

        response = []
        for reservation in reservations:
            response.append({
                "id": reservation.id,
                "reserve_id": reservation.reserve_id,
                "todo_content": reservation.todo_content,
                "person_id": reservation.person_id,
                "person_name": reservation.user.kanji_name if reservation.user else "不明",
                "office_id": reservation.office_id,
                "office_name": reservation.office.office_name if reservation.office else "不明",
                "seat_id": reservation.seat_id,
                "seat_name": reservation.seat_regist.seat_name if reservation.seat_regist else "不明",
                "pasokon_id": reservation.pasokon_id,
                "pasokon_name": reservation.pasokon_reserve.pasokon_name if reservation.pasokon_reserve else "不明",
                "start_time": reservation.start_time,
                "finish_time": reservation.finish_time,
                "reserve_day": reservation.reserve_day,
                "created_at": reservation.created_at,
                "updated_at": reservation.updated_at,
            })

        return response
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="内部サーバーエラーが発生しました")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="予期しないエラーが発生しました")


@router.get("/seat_reservation/{reservation_id}", response_model=SeatReservationResponse)
def get_reservation_by_id(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(DBSeatReservation).filter(DBSeatReservation.id == reservation_id).first()
    if reservation is None:
        raise HTTPException(status_code=404, detail="予約が見つかりません")
    return reservation


@router.post("/seat_reservation/new/", response_model=SeatReservationResponse)
def create_reservation(reservation: SeatReservationCreate, db: Session = Depends(get_db)):
    in_active_yoyakuchu = 1
    in_active_shiyouka = 2
    # 重複チェック：時間が重なり、同一の座席または同一のパソコン
    overlap_query = db.query(DBSeatReservation).filter(
        DBSeatReservation.finish_time > reservation.start_time,
        DBSeatReservation.start_time < reservation.finish_time
    ).filter(
        (DBSeatReservation.seat_id == reservation.seat_id) |
        (DBSeatReservation.pasokon_id == reservation.pasokon_id)
    )

    if db.query(overlap_query.exists()).scalar():
        raise HTTPException(status_code=400, detail="同じ座席またはパソコンで既に予約があります")
    
    # reserve_id + reserve_day の重複チェック
    same_reserve_id = db.query(DBSeatReservation).filter(
        DBSeatReservation.reserve_id == reservation.reserve_id,
        DBSeatReservation.reserve_day == reservation.reserve_day
    ).first()

    if same_reserve_id:
        raise HTTPException(status_code=400, detail="同じ日付に同じ予約IDの予約が既に存在します")

    try:
        db_reservation = DBSeatReservation(**reservation.dict())
        db.add(db_reservation)
        db.commit()
        db.refresh(db_reservation)

        # 日本時間のタイムゾーンを取得
        jst = timezone('Asia/Tokyo')

        # start_time と finish_time を JST に変換（もし既に tzinfo ありなら astimezone）
        start_time_jst = reservation.start_time.astimezone(jst) if reservation.start_time.tzinfo else jst.localize(reservation.start_time)
        finish_time_jst = reservation.finish_time.astimezone(jst) if reservation.finish_time.tzinfo else jst.localize(reservation.finish_time)

        # スケジュール登録：開始時刻に「予約中」、終了時刻に「使用可」
        scheduler.add_job(
            change_pasokon_status,
            trigger=DateTrigger(run_date=start_time_jst),
            args=[db, reservation.pasokon_id, in_active_yoyakuchu]  # 予約中
        )

        scheduler.add_job(
            change_pasokon_status,
            trigger=DateTrigger(run_date=finish_time_jst),
            args=[db, reservation.pasokon_id, in_active_shiyouka]  # 使用可
        )

        return db_reservation
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="予約IDが既に存在しています")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"データベースエラー: {str(e)}")


@router.put("/seat_reservation/{reservation_id}", response_model=SeatReservationResponse)
def update_reservation(reservation_id: int, reservation_update: SeatReservationUpdate, db: Session = Depends(get_db)):
    db_reservation = db.query(DBSeatReservation).filter(DBSeatReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="予約が見つかりません")

    # 値を更新
    for key, value in reservation_update.dict(exclude_unset=True).items():
        setattr(db_reservation, key, value)

    updated_start = db_reservation.start_time
    updated_end = db_reservation.finish_time
    updated_seat_id = db_reservation.seat_id
    updated_pasokon_id = db_reservation.pasokon_id
    updated_reserve_id = db_reservation.reserve_id
    updated_reserve_day = db_reservation.reserve_day

    # 同日・同予約IDの重複チェック（自分以外）
    same_reserve = db.query(DBSeatReservation).filter(
        DBSeatReservation.id != reservation_id,
        DBSeatReservation.reserve_id == updated_reserve_id,
        DBSeatReservation.reserve_day == updated_reserve_day
    ).first()

    if same_reserve:
        raise HTTPException(status_code=400, detail="同じ日付に同じ予約IDの予約が既に存在します")
    
    # 自身を除いた重複チェック（時間 × 座席 or パソコン）
    overlapping_reservation = db.query(DBSeatReservation).filter(
        DBSeatReservation.id != reservation_id,
        DBSeatReservation.finish_time > updated_start,
        DBSeatReservation.start_time < updated_end
    ).filter(
        (DBSeatReservation.seat_id == updated_seat_id) |
        (DBSeatReservation.pasokon_id == updated_pasokon_id)
    ).first()

    if overlapping_reservation:
        raise HTTPException(status_code=400, detail="同じ座席またはパソコンで既に予約があります")

    try:
        db.commit()
        db.refresh(db_reservation)
        return db_reservation
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"データベースエラー: {str(e)}")


@router.delete("/seat_reservation/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = db.query(DBSeatReservation).filter(DBSeatReservation.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="予約が見つかりません")

    db.delete(db_reservation)
    db.commit()
