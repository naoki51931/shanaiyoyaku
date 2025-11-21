import os
import logging
from logging import getLogger, StreamHandler

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from routers import (
    user,
    seat_regist,
    office,
    pasokon,
    seat_reservation,
    tag,
)
from utils.restore import router as restore_router
from routers.health_router import router as health_router
from utils.restore import backup_today
from auth import router as auth_router
from scheduler_config import scheduler
from database.database import init_db


# ============================================================
# 環境変数ロード
# ============================================================
load_dotenv()

HOST = os.environ.get("HOST")
if not HOST:
    raise ValueError("HOSTが設定されていません。環境変数 HOST を .env に設定してください。")

APP_ENV = os.environ.get("APP_ENV", "test")  # デフォルト test


# ============================================================
# ロガー設定
# ============================================================
logger = getLogger(__name__)
handler = StreamHandler()
logger.addHandler(handler)
logger.setLevel(logging.INFO)

logging.basicConfig()
logging.getLogger("apscheduler").setLevel(logging.DEBUG)


# ============================================================
# FastAPI アプリ本体
# ============================================================
app = FastAPI()


# ============================================================
# CORS 設定
# ============================================================
origins = [HOST]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# アプリ起動時処理
#   - APP_ENV == "production" のときだけ init_db() を走らせる
#   - "test" のときは initdb.d の SQL に任せる
# ============================================================
@app.on_event("startup")
def on_startup() -> None:
    if APP_ENV == "production":
        logger.info("APP_ENV=production → SQLAlchemy init_db() でテーブルを作成/更新します。")
        init_db()
    else:
        logger.info("APP_ENV!=production → init_db() は実行せず、MySQL initdb.d のSQLに任せます。")

    if not scheduler.running:
        logger.info("Registering daily backup job (2:00) and starting scheduler...")
        scheduler.add_job(backup_today, "cron", hour=2)
        scheduler.start()


# ============================================================
# アプリ終了時処理（scheduler の停止など）
# ============================================================
@app.on_event("shutdown")
def on_shutdown() -> None:
    if scheduler.running:
        logger.info("Shutting down APScheduler...")
        scheduler.shutdown()


# ============================================================
# 例外ハンドラ
# ============================================================
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    バリデーションエラーを JSON で返す
    """
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": jsonable_encoder(exc.errors()),
            "body": jsonable_encoder(exc.body),
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """
    想定外エラー用のハンドラ（スタックトレースはログにだけ出す）
    """
    logger.exception("Unhandled server error")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal Server Error"},
    )


# ============================================================
# ルーター登録
#   - nginx の location と合わせて prefix を揃える
# ============================================================
# /auth → 認証系
app.include_router(auth_router, prefix="/api", tags=["auth"])

# /user → ユーザー管理
app.include_router(user.router, prefix="/api", tags=["user"])

# /seat → 座席マスタ（モジュール名は seat_regist だが URL は /seat に寄せる）
app.include_router(seat_regist.router, prefix="/api", tags=["seat"])

# /office → オフィス
app.include_router(office.router, prefix="/api", tags=["office"])

# /pasokon → PC マスタ
app.include_router(pasokon.router, prefix="/api", tags=["pasokon"])

# /seat_reservation → 予約
app.include_router(
    seat_reservation.router,
    prefix="/api",
    tags=["seat_reservation"],
)

# /tags → タグ
app.include_router(tag.router, prefix="/api", tags=["tags"])

# /backup, /backups, /download, /restore など
# （utils.restore 側でパスを定義している想定なので prefix は付けない）
app.include_router(restore_router, prefix="/api")


app.include_router(health_router, prefix="/api")

