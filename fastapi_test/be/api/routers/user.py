from sqlite3 import IntegrityError
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
import bcrypt

from database.database import get_db
from models.sqlalchemy.user import User as DBUser
from models.pydantic.user import UserCreate, UserResponse, UserUpdate

router = APIRouter()

# リクエストbodyを定義
class User(BaseModel):
    kanji_name: str

# パスワードハッシュ化関数
def hash_password(password: str) -> str:
    # bcryptでハッシュ化
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

@router.post("/user/", response_model=UserResponse)
async def get_user_by_name(user: User, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.kanji_name == user.kanji_name).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

@router.post("/user/new/", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # パスワードをハッシュ化
        hashed_password = hash_password(user.password)

        # ユーザーの作成（ハッシュ化されたパスワードを使用）
        db_user = DBUser(**{k: v for k, v in user.dict().items() if k != 'password'}, password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user  
    except IntegrityError:
        db.rollback()
        return {
            "status": False,
            "access_token": None,
            "message": "このユーザー名は既に登録されています",
            "data": None,
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@router.get("/user/all/")
def read_user_all(db: Session = Depends(get_db)):
    try:
        users_data = db.query(DBUser).all()
        results = [
            {
                "id": user.id,
                "user_name": user.user_name,
                "password": user.password,
                "kanji_name": user.kanji_name,
                "kata_name": user.kata_name,
                "position": user.position,
                "is_superuser": user.is_superuser,
                "is_approval": user.is_approval,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None,
            }
            for user in users_data
        ]
        return JSONResponse(content=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}", response_model=UserResponse)
def read_user_by_id(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

def is_hashed(password: str) -> bool:
    """bcryptでハッシュ化されたパスワードかを判定"""
    return password.startswith("$2b$")

@router.put("/user/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    try:
        db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
        if db_user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # パスワードが存在し、かつ未ハッシュの場合にのみハッシュ化
        if user_update.password and not is_hashed(user_update.password):
            user_update.password = hash_password(user_update.password)

        for key, value in user_update.dict(exclude_unset=True).items():
            setattr(db_user, key, value)

        db.commit()
    except IntegrityError:
        return {
            "status": False,
            'access_token': None,
            "message": "このユーザー名は既に登録されています",
            "data": None,
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
    finally:
        db.refresh(db_user)
        return db_user

@router.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(db_user)
    db.commit()
