from sqlalchemy.exc import SQLAlchemyError
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database.database import get_db
from models.sqlalchemy.pasokon import Pasokon as DBPasokon
from models.sqlalchemy.tag import Tag
from models.sqlalchemy.office import Office as DBOffice
from models.pydantic.pasokon import PasokonCreate, PasokonResponse, PasokonUpdate
from models.sqlalchemy.seat_regist import SeatRegist as DBSeatRegist


router = APIRouter()

# Pasokon作成リクエスト用のPydanticモデル
class PasokonSearch(BaseModel):
    query: str

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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching pasokons found")

    results = [
        {
            "id": pasokon.id,
            "pasokon_name": pasokon.pasokon_name,
            "in_active": pasokon.in_active,
            "office_id": pasokon.office_id,
            "office_name": pasokon.office_in_pasokon.office_name if pasokon.office_in_pasokon else None,
            "seat_id": pasokon.seat_id,
            "seat_name": pasokon.seat_in_pasokon.seat_name if pasokon.seat_in_pasokon else None,
            "created_at": pasokon.created_at,
            "updated_at": pasokon.updated_at,
            "soft_ids": [tag.id for tag in pasokon.tags],  # soft_idsを追加
            "soft_names": [tag.name for tag in pasokon.tags],  # soft_namesを追加
        }
        for pasokon in db_pasokons
    ]

    return results

@router.post("/pasokon/new/", response_model=PasokonResponse)
async def create_pasokon(pasokon: PasokonCreate, db: Session = Depends(get_db)):
    try:
        # soft_names が None の場合は空リストとして扱う
        soft_names = pasokon.soft_names if pasokon.soft_names else []

        # タグ名を受け取って、Tagオブジェクトを取得または新規作成
        tags = []
        for tag_name in soft_names:
            existing_tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if existing_tag:
                tags.append(existing_tag)  # 既存タグを使用
            else:
                new_tag = Tag(name=tag_name)  # 新しいタグを作成
                db.add(new_tag)
                db.commit()
                db.refresh(new_tag)
                tags.append(new_tag)  # 新しいタグをリストに追加する

        # Pasokon作成
        db_pasokon = DBPasokon(
            pasokon_name=pasokon.pasokon_name,
            in_active=pasokon.in_active,
            # ソフト名をタグIDのリストに変換
            soft_ids=[tag.id for tag in tags],  # タグIDをリストとして格納
            soft_names=[tag.name for tag in tags],  # タグ名をリストとして格納
            office_id=pasokon.office_id,
            seat_id=pasokon.seat_id,
        )

        db.add(db_pasokon)
        db.commit()
        db.refresh(db_pasokon)

        return db_pasokon

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database error occurred") from e

@router.get("/pasokon/all/")
def read_pasokon_all(db: Session = Depends(get_db)):
    try:
        pasokons_data = db.query(DBPasokon).all()
        results = [
            {
                "id": pasokon.id,
                "pasokon_name": pasokon.pasokon_name,
                "in_active": pasokon.in_active,
                "office_id": pasokon.office_id,
                "office_name": pasokon.office_in_pasokon.office_name if pasokon.office_in_pasokon else None,
                "seat_id": pasokon.seat_id,
                "seat_name": pasokon.seat_in_pasokon.seat_name if pasokon.seat_in_pasokon else None,
                "soft_ids": [tag.id for tag in pasokon.tags],  # ここでsoft_idsを追加
                "soft_names": [tag.name for tag in pasokon.tags],  # ここでsoft_namesを追加
                "created_at": pasokon.created_at.isoformat() if pasokon.created_at else None,
                "updated_at": pasokon.updated_at.isoformat() if pasokon.updated_at else None,
            }
            for pasokon in pasokons_data
        ]
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/pasokon/{pasokon_id}", response_model=PasokonResponse)
def read_pasokon_by_id(pasokon_id: int, db: Session = Depends(get_db)):
    db_pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()
    if db_pasokon is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pasokon not found")
    return db_pasokon

@router.put("/pasokon/{pasokon_id}", response_model=PasokonResponse)
async def update_pasokon(pasokon_id: int, pasokon_update: PasokonUpdate, db: Session = Depends(get_db)):
    try:
        # パソコンIDを使ってデータベースからパソコン情報を取得
        db_pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()

        # パソコンが見つからない場合はエラー
        if db_pasokon is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pasokon not found")

        # タグIDを使って、関連するタグをデータベースから取得
        tags = db.query(Tag).filter(Tag.id.in_(pasokon_update.soft_ids)).all()

        # タグが見つからない場合はエラー
        if len(tags) != len(pasokon_update.soft_ids):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or more tags not found")

        # パソコンとタグを関連付け
        db_pasokon.tags = tags

        # 事務所と座席の情報を更新
        office = db.query(DBOffice).filter(DBOffice.id == pasokon_update.office_id).first()
        if office is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Office not found")
        
        seat = db.query(DBSeatRegist).filter(DBSeatRegist.id == pasokon_update.seat_id).first()
        if seat is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat not found")
        
        db_pasokon.office_id = pasokon_update.office_id
        db_pasokon.seat_id = pasokon_update.seat_id

        # パソコンの他のフィールドを更新
        db_pasokon.pasokon_name = pasokon_update.pasokon_name
        db_pasokon.in_active = pasokon_update.in_active

        # 変更をコミット
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database error occurred") from e
    finally:
        # パソコン情報をリフレッシュして最新の状態を取得
        db.refresh(db_pasokon)
        return db_pasokon

@router.delete("/pasokon/{pasokon_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pasokon(pasokon_id: int, db: Session = Depends(get_db)):
    db_pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()
    if db_pasokon is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pasokon not found")

    db.delete(db_pasokon)
    db.commit()
