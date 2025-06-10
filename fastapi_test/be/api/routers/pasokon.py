from sqlite3 import IntegrityError
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_

from database.database import get_db
from models.sqlalchemy.pasokon import Pasokon as DBPasokon
from models.sqlalchemy.office import Office as DBOffice
from models.pydantic.pasokon import PasokonCreate, PasokonResponse, PasokonUpdate

router = APIRouter()

# 検索リクエスト用の Pydantic モデル
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
        }
        for pasokon in db_pasokons
    ]

    return results

@router.post("/pasokon/new/", response_model=PasokonResponse)
async def create_pasokon(pasokon: PasokonCreate, db: Session = Depends(get_db)):
    try:
        db_pasokon = DBPasokon(**pasokon.dict())
        db.add(db_pasokon)
        db.commit()
        db.refresh(db_pasokon)
        return db_pasokon  
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="この事業所名は既に登録されています"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

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
                "created_at": pasokon.created_at.isoformat() if pasokon.created_at else None,
                "updated_at": pasokon.updated_at.isoformat() if pasokon.updated_at else None,
            }
            for pasokon in pasokons_data
        ]
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pasokon/{pasokon_id}", response_model=PasokonResponse)
def read_pasokon_by_id(pasokon_id: int, db: Session = Depends(get_db)):
    db_pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()
    if db_pasokon is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pasokon not found")
    return db_pasokon

@router.put("/pasokon/{pasokon_id}", response_model=PasokonResponse)
async def update_pasokon(pasokon_id: int, pasokon_update: PasokonUpdate, db: Session = Depends(get_db)):
    try:
        db_pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()
        if db_pasokon is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pasokon not found")

        for key, value in pasokon_update.dict(exclude_unset=True).items():
            setattr(db_pasokon, key, value)

        db.commit()
    except IntegrityError:
        return {
            "status": False,
            "message": "このパソコン名は既に登録されています",
            "data": None,
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
    finally:
        db.refresh(db_pasokon)
        return db_pasokon

@router.delete("/pasokon/{pasokon_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pasokon(pasokon_id: int, db: Session = Depends(get_db)):
    db_pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()
    if db_pasokon is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pasokon not found")

    db.delete(db_pasokon)
    db.commit()
