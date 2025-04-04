from sqlite3 import IntegrityError
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_

from database.database import get_db
from models.sqlalchemy.seat_regist import SeatRegist as DBSeatRegist
from models.sqlalchemy.office import Office as DBOffice
from models.pydantic.seat_regist import SeatRegistCreate, SeatRegistResponse, SeatRegistUpdate

router = APIRouter()

# 検索リクエスト用の Pydantic モデル
class SeatRegistSearch(BaseModel):
    query: str

# ① レスポンス用のスキーマを定義
class OfficeResponse(BaseModel):
    id: int
    office_name: str

    class Config:
        orm_mode = True

# ② 修正されたエンドポイント
@router.get("/office/all/", response_model=list[OfficeResponse])
def get_offices(db: Session = Depends(get_db)):
    """オフィスのIDと名前の一覧を取得"""
    offices = db.query(DBOffice).all()
    return offices

@router.post("/seat/search/", response_model=list[SeatRegistResponse])
async def search_seats(seat_search: SeatRegistSearch, db: Session = Depends(get_db)):
    """
    seat_name、office_name のいずれかにキーワードが含まれる座席を検索する
    """
    query = seat_search.query.strip()

    db_seats = (
        db.query(DBSeatRegist)
        .join(DBOffice)
        .options(joinedload(DBSeatRegist.office))
        .filter(
            or_(
                DBSeatRegist.seat_name.ilike(f"%{query}%"),
                DBOffice.office_name.ilike(f"%{query}%"),
            )
        )
        .all()
    )

    if not db_seats:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching seats found")

    results = [
        {
            "id": seat.id,
            "seat_name": seat.seat_name,
            "office_id": seat.office_id,
            "office_name": seat.office.office_name if seat.office else None,
            "created_at": seat.created_at,
            "updated_at": seat.updated_at,
        }
        for seat in db_seats
    ]

    return results

@router.post("/seat/new/", response_model=SeatRegistResponse)
async def create_seat(seat: SeatRegistCreate, db: Session = Depends(get_db)):
    try:
        db_seat = DBSeatRegist(**seat.dict())
        db.add(db_seat)
        db.commit()
        db.refresh(db_seat)
        return db_seat  
    except IntegrityError:
        db.rollback()
        return {
            "status": False,
            "message": "この座席名は既に登録されています",
            "data": None,
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

@router.get("/seat/all/")
def read_seat_all(db: Session = Depends(get_db)):
    try:
        seats_data = db.query(DBSeatRegist).options(joinedload(DBSeatRegist.office)).all()
        results = [
            {
                "id": seat.id,
                "seat_name": seat.seat_name,
                "office_id": seat.office_id,
                "office_name": seat.office.office_name if seat.office else None,
                "created_at": seat.created_at.isoformat() if seat.created_at else None,
                "updated_at": seat.updated_at.isoformat() if seat.updated_at else None,
            }
            for seat in seats_data
        ]
        return JSONResponse(content=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/seat/{seat_id}", response_model=SeatRegistResponse)
def read_seat_by_id(seat_id: int, db: Session = Depends(get_db)):
    db_seat = db.query(DBSeatRegist).filter(DBSeatRegist.id == seat_id).first()
    if db_seat is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SeatRegist not found")
    return db_seat

@router.put("/seat/{seat_id}", response_model=SeatRegistResponse)
async def update_seat(seat_id: int, seat_update: SeatRegistUpdate, db: Session = Depends(get_db)):
    try:
        db_seat = db.query(DBSeatRegist).filter(DBSeatRegist.id == seat_id).first()
        if db_seat is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SeatRegist not found")

        for key, value in seat_update.dict(exclude_unset=True).items():
            setattr(db_seat, key, value)

        db.commit()
    except IntegrityError:
        return {
            "status": False,
            "message": "この座席名は既に登録されています",
            "data": None,
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
    finally:
        db.refresh(db_seat)
        return db_seat

@router.delete("/seat/{seat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_seat(seat_id: int, db: Session = Depends(get_db)):
    db_seat = db.query(DBSeatRegist).filter(DBSeatRegist.id == seat_id).first()
    if db_seat is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SeatRegist not found")

    db.delete(db_seat)
    db.commit()
