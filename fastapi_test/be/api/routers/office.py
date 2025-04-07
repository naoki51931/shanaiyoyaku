from sqlite3 import IntegrityError
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_

from database.database import get_db
from models.sqlalchemy.office import Office as DBOffice
from models.pydantic.office import OfficeCreate, OfficeResponse, OfficeUpdate

router = APIRouter()

# 検索リクエスト用の Pydantic モデル
class OfficeSearch(BaseModel):
    query: str


@router.post("/office/search/", response_model=list[OfficeResponse])
async def search_offices(office_search: OfficeSearch, db: Session = Depends(get_db)):
    """
    office_name、office_name のいずれかにキーワードが含まれる座席を検索する
    """
    query = office_search.query.strip()

    db_offices = (
        db.query(DBOffice)
        .filter(
            or_(
                DBOffice.office_id.ilike(f"%{query}%"),
                DBOffice.office_name.ilike(f"%{query}%"),
            )
        )
        .all()
    )

    if not db_offices:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching offices found")

    results = [
        {
            "id": office.id,
            "office_name": office.office_name,
            "office_id": office.office_id,
            "created_at": office.created_at,
            "updated_at": office.updated_at,
        }
        for office in db_offices
    ]

    return results

@router.post("/office/new/", response_model=OfficeResponse)
async def create_office(office: OfficeCreate, db: Session = Depends(get_db)):
    try:
        db_office = DBOffice(**office.dict())
        db.add(db_office)
        db.commit()
        db.refresh(db_office)
        return db_office  
    except IntegrityError:
        db.rollback()
        return {
            "status": False,
            "message": "この事業所名は既に登録されています",
            "data": None,
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

@router.get("/office/all/")
def read_office_all(db: Session = Depends(get_db)):
    try:
        offices_data = db.query(DBOffice).all()
        results = [
            {
                "id": office.id,
                "office_name": office.office_name,
                "office_id": office.office_id,
                "created_at": office.created_at.isoformat() if office.created_at else None,
                "updated_at": office.updated_at.isoformat() if office.updated_at else None,
            }
            for office in offices_data
        ]
        return JSONResponse(content=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/office/{office_id}", response_model=OfficeResponse)
def read_office_by_id(office_id: int, db: Session = Depends(get_db)):
    db_office = db.query(DBOffice).filter(DBOffice.id == office_id).first()
    if db_office is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Office not found")
    return db_office

@router.put("/office/{office_id}", response_model=OfficeResponse)
async def update_office(office_id: int, office_update: OfficeUpdate, db: Session = Depends(get_db)):
    try:
        db_office = db.query(DBOffice).filter(DBOffice.id == office_id).first()
        if db_office is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Office not found")

        for key, value in office_update.dict(exclude_unset=True).items():
            setattr(db_office, key, value)

        db.commit()
    except IntegrityError:
        return {
            "status": False,
            "message": "この事業所名は既に登録されています",
            "data": None,
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
    finally:
        db.refresh(db_office)
        return db_office

@router.delete("/office/{office_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_office(office_id: int, db: Session = Depends(get_db)):
    db_office = db.query(DBOffice).filter(DBOffice.id == office_id).first()
    if db_office is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Office not found")

    db.delete(db_office)
    db.commit()
