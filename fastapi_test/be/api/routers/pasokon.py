from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List


from database.database import get_db
from models.sqlalchemy.pasokon import Pasokon as DBPasokon
from models.sqlalchemy.tag import Tag
from models.sqlalchemy.office import Office as DBOffice
from models.pydantic.pasokon import PasokonCreate, PasokonResponse, PasokonUpdate
from models.sqlalchemy.seat_regist import SeatRegist as DBSeatRegist

router = APIRouter()

# ------------------------------------------------------------------
# 検索用モデル
# ------------------------------------------------------------------
class PasokonSearch(BaseModel):
    query: str

# ------------------------------------------------------------------
# 検索エンドポイント
# ------------------------------------------------------------------
@router.post("/pasokon/search/", response_model=list[PasokonResponse])
async def search_pasokons(pasokon_search: PasokonSearch, db: Session = Depends(get_db)):
    query = pasokon_search.query.strip()

    db_pasokons = (
        db.query(DBPasokon)
        .join(DBOffice, DBPasokon.office_id == DBOffice.id)
        .filter(
            or_(
                DBPasokon.office_id.ilike(f"%{query}%"),
                DBPasokon.pasokon_name.ilike(f"%{query}%"),
            )
        )
        .all()
    )

    if not db_pasokons:
        raise HTTPException(404, "No matching pasokons found")

    return [
        {
            "id": p.id,
            "pasokon_name": p.pasokon_name,
            "in_active": p.in_active,
            "office_id": p.office_id,
            "office_name": p.office_in_pasokon.office_name if p.office_in_pasokon else None,
            "seat_id": p.seat_id,
            "seat_name": p.seat_in_pasokon.seat_name if p.seat_in_pasokon else None,
            "performance": p.performance,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
            "soft_ids": [t.id for t in p.tags],
            "soft_names": [t.name for t in p.tags],
        }
        for p in db_pasokons
    ]

# ------------------------------------------------------------------
# 新規作成
# ------------------------------------------------------------------
@router.post("/pasokon/new/", response_model=PasokonResponse)
async def create_pasokon(pasokon: PasokonCreate, db: Session = Depends(get_db)):
    try:
        # ---------- タグ準備 ----------
        tag_objs = []
        for name in pasokon.soft_names or []:
            tag = db.query(Tag).filter(Tag.name == name).first()
            if not tag:
                tag = Tag(name=name)
                db.add(tag)
                db.flush()  # id 取得
            tag_objs.append(tag)

        # ---------- 外部キー存在チェック ----------
        office = db.query(DBOffice).filter(DBOffice.id == pasokon.office_id).first()
        if not office:
            raise HTTPException(404, "Office not found")

        seat = db.query(DBSeatRegist).filter(DBSeatRegist.id == pasokon.seat_id).first()
        if not seat:
            raise HTTPException(404, "Seat not found")

        # ---------- 重複チェック ----------
        if db.query(DBPasokon).filter(DBPasokon.pasokon_name == pasokon.pasokon_name).first():
            raise HTTPException(409, "pasokon_name already exists")

        # ---------- Pasokon 作成 ----------
        db_pasokon = DBPasokon(
            pasokon_name=pasokon.pasokon_name,
            in_active=pasokon.in_active,
            office_id=pasokon.office_id,
            seat_id=pasokon.seat_id,
            performance=pasokon.performance,
        )
        db_pasokon.tags = tag_objs

        db.add(db_pasokon)
        db.commit()
        db.refresh(db_pasokon)
        return db_pasokon

    except IntegrityError as e:
        db.rollback()
        # 万一のユニーク制約違反 (念のため)
        raise HTTPException(409, "Duplicate pasokon_name") from e
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(400, "Database error") from e

# ------------------------------------------------------------------
# 一覧取得
# ------------------------------------------------------------------
@router.get("/pasokon/all/", response_model=List[PasokonResponse])
def read_pasokon_all(db: Session = Depends(get_db)):
    pasokons = db.query(DBPasokon).all()
    return [
        {
            "id": p.id,
            "pasokon_name": p.pasokon_name,
            "in_active": p.in_active,
            "office_id": p.office_id,
            "office_name": p.office_in_pasokon.office_name if p.office_in_pasokon else None,
            "seat_id": p.seat_id,
            "seat_name": p.seat_in_pasokon.seat_name if p.seat_in_pasokon else None,
            "soft_ids": [t.id for t in p.tags],
            "soft_names": [t.name for t in p.tags],
            "performance": p.performance,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None,
        }
        for p in pasokons
    ]

# ------------------------------------------------------------------
# 個別取得
# ------------------------------------------------------------------
@router.get("/pasokon/{pasokon_id}", response_model=PasokonResponse)
def read_pasokon_by_id(pasokon_id: int, db: Session = Depends(get_db)):
    db_pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()
    if not db_pasokon:
        raise HTTPException(404, "Pasokon not found")
    return db_pasokon

# ------------------------------------------------------------------
# 更新
# ------------------------------------------------------------------
@router.put("/pasokon/{pasokon_id}", response_model=PasokonResponse)
async def update_pasokon(pasokon_id: int, pasokon_update: PasokonUpdate, db: Session = Depends(get_db)):
    db_pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()
    if not db_pasokon:
        raise HTTPException(404, "Pasokon not found")

    # タグ再構築
    tags = db.query(Tag).filter(Tag.id.in_(pasokon_update.soft_ids)).all()
    if len(tags) != len(pasokon_update.soft_ids):
        raise HTTPException(404, "One or more tags not found")
    db_pasokon.tags = tags

    # 外部キー存在確認
    office = db.query(DBOffice).filter(DBOffice.id == pasokon_update.office_id).first()
    if not office:
        raise HTTPException(404, "Office not found")
    seat = db.query(DBSeatRegist).filter(DBSeatRegist.id == pasokon_update.seat_id).first()
    if not seat:
        raise HTTPException(404, "Seat not found")

    # 重複名チェック（自分以外）
    dup = (
        db.query(DBPasokon)
        .filter(DBPasokon.pasokon_name == pasokon_update.pasokon_name, DBPasokon.id != pasokon_id)
        .first()
    )
    if dup:
        raise HTTPException(409, "pasokon_name already exists")

    # 値を反映
    db_pasokon.pasokon_name = pasokon_update.pasokon_name
    db_pasokon.in_active = pasokon_update.in_active
    db_pasokon.office_id = pasokon_update.office_id
    db_pasokon.seat_id = pasokon_update.seat_id
    db_pasokon.performance = pasokon_update.performance

    try:
        db.commit()
        db.refresh(db_pasokon)
        return db_pasokon
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(400, "Database error occurred") from e

# ------------------------------------------------------------------
# 削除
# ------------------------------------------------------------------
@router.delete("/pasokon/{pasokon_id}", status_code=204)
async def delete_pasokon(pasokon_id: int, db: Session = Depends(get_db)):
    db_pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()
    if not db_pasokon:
        raise HTTPException(404, "Pasokon not found")

    db.delete(db_pasokon)
    db.commit()


@router.get("/pasokon/by-seat/{seat_id}")
def get_pasokons_by_seat(seat_id: int, db: Session = Depends(get_db)):
    pasokons = db.query(DBPasokon).filter(DBPasokon.seat_id == seat_id).all()
    return [
        {"id": p.id, "pasokon_name": p.pasokon_name}
        for p in pasokons
    ]