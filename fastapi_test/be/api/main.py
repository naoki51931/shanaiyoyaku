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
from utils.restore import backup_today
from auth import router as auth_router
from scheduler_config import scheduler

from database.database import init_db  # ← ここは今のまま


# ============================================================
# 環境変数ロード
# ============================================================
load_dotenv()

HOST = os.environ.get("HOST")
if not HOST:
    raise ValueError("HOSTが設定されていません。環境変数 HOST を .env に設定してください。")

APP_ENV = os.environ.get("APP_ENV", "test")  # ← 追加: デフォルト test


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

