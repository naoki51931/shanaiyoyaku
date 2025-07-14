import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from logging import getLogger, StreamHandler


from routers import user
from routers import seat_regist
from routers import office
from routers import pasokon
from routers import seat_reservation
from routers import tag
from auth import router as auth_router  # auth.py をインポート
from dotenv import load_dotenv


load_dotenv()  # .envファイルから環境変数を読み込む

HOST = os.environ.get("HOST")  
if not HOST:
    raise ValueError("HOSTが設定されていません。環境変数に設定してください。")

app = FastAPI()

logger = getLogger(__name__)
logger.addHandler(StreamHandler()) # ただしこれらの設定が必要
logger.setLevel("INFO")            # ただしこれらの設定が必要

# CORS設定
origins = [
    HOST,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#ステータスコード422エラーの表示
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )

@app.exception_handler(RequestValidationError)
async def handler(request:Request, exc:RequestValidationError):
    #print(exc)
    logger.info(f"Returning {exc}")

    return JSONResponse(content={}, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

@app.exception_handler(Exception)
async def exception_handler(request, exc):
    return {"message": str(exc)}

app.include_router(user.router)
app.include_router(seat_regist.router)
app.include_router(office.router)
app.include_router(pasokon.router)
app.include_router(seat_reservation.router)
app.include_router(tag.router)
app.include_router(auth_router, prefix="/auth")  # 認証用のエンドポイントを登録