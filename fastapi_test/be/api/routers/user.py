from sqlite3 import IntegrityError
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
import bcrypt
from sqlalchemy import or_

from database.database import get_db
from models.sqlalchemy.user import User as DBUser
from models.pydantic.user import UserCreate, UserResponse, UserUpdate

# ★ 追加（パスはプロジェクト構成に合わせて）
from auth import get_current_user

router = APIRouter()

# リクエストbodyを定義
class User(BaseModel):
    kanji_name: str

# パスワードハッシュ化関数
def hash_password(password: str) -> str:
    # bcryptでハッシュ化
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# 検索リクエスト用の Pydantic モデル
class UserSearch(BaseModel):
    query: str

@router.post("/user/search/", response_model=list[UserResponse])
async def search_users(user_search: UserSearch, db: Session = Depends(get_db)):
    """
    user_name、kanji_name、kata_name のいずれかにキーワードが含まれるユーザーを検索する
    """
    query = user_search.query.strip()  # 前後の空白を除去

    db_users = (
        db.query(DBUser)
        .filter(
            or_(
                DBUser.user_name.ilike(f"%{query}%"),
                DBUser.kanji_name.ilike(f"%{query}%"),
                DBUser.kata_name.ilike(f"%{query}%"),
            )
        )
        .all()
    )

    if not db_users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching users found")

    return db_users

@router.post("/user/new/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),  # ★ ログインユーザー
):
    try:
        # パスワードをハッシュ化
        hashed_password = hash_password(user.password)

        # ユーザーの作成（ハッシュ化されたパスワードを使用）
        db_user = DBUser(
            **{k: v for k, v in user.dict().items() if k != 'password'},
            password=hashed_password,
        )

        # ★ ここで作成者をセット
        # current_user.user_name / current_user.kanji_name など、
        # 好きな情報を author に使ってOK
        db_user.author = current_user.user_name

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
                "author": user.author,
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
        
        user_update = user_update.dict(exclude_unset=True)
        user_update.pop("author", None)  # ★ ここで author の更新を禁止
        for key, value in user_update.items():
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
