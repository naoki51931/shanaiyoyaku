from datetime import timedelta, datetime
import os
from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database.database import get_db
from models.sqlalchemy.user import User as DBUser
from models.pydantic.user import UserCreate, UserResponse
from dotenv import load_dotenv


load_dotenv()  # .envファイルから環境変数を読み込む

SECRET_KEY = os.environ.get("SECRET_KEY")  # セキュリティ上、環境変数に保存するのが理想的です
if not SECRET_KEY:
    raise ValueError("SECRET_KEYが設定されていません。環境変数に設定してください。")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

# パスワードのハッシュ化
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2のスキーム
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# パスワードのハッシュ化関数
def hash_password(password: str):
    return pwd_context.hash(password)

# パスワード検証関数
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# JWTトークンの作成関数
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ユーザー認証関数
def authenticate_user(db: Session, username: str, password: str):
    user = db.query(DBUser).filter(DBUser.user_name == username).first()
    if not user or not verify_password(password, user.password):
        return False
    if not user.is_active:  # 無効なユーザーをブロック
        return False
    return user

# 🔒 ログインエンドポイント
@router.post("/auth/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザー名またはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # トークンの生成
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.user_name,
            "position": user.position,          # positionを追加
            "is_approval": user.is_approval,    # is_approvalを追加
            "is_superuser": user.is_superuser,  # is_superuserを追加
        }, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# ============================================================
# 共通：トークンから現在のユーザー(DBUser)を取得する依存関数
# ============================================================
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> DBUser:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="トークンにユーザー情報が含まれていません"
            )
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="トークンの有効期限が切れています。")
    except JWTError:
        raise HTTPException(status_code=401, detail="無効なトークンまたはトークンクレームが無効です。")

    user = db.query(DBUser).filter(DBUser.user_name == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりません"
        )

    return user

#🔐 保護されたエンドポイントの例
@router.get("/auth/users/me", response_model=UserResponse)
async def read_users_me(current_user: DBUser = Depends(get_current_user)):
    # DBUser モデルをそのまま返せばOK（response_model が整形してくれる）
    return current_user

