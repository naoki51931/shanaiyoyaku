from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from logging import getLogger, StreamHandler


from routers import user

app = FastAPI()

logger = getLogger(__name__)
logger.addHandler(StreamHandler()) # ただしこれらの設定が必要
logger.setLevel("INFO")            # ただしこれらの設定が必要

# CORS設定
origins = [
    "http://localhost:3000",
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

app.include_router(user.router)