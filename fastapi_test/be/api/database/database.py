# be/api/database/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ============================================================
# 接続設定
# ============================================================
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://mysqluser:mysqlpass@db:3306/sample_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ============================================================
# DB セッション依存性（Depends 用）
# ============================================================
def get_db():
    """FastAPI の Depends から使う DB セッション"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
# 初期化関数（テーブル自動作成用）
# ============================================================
def init_db() -> None:
    """
    アプリ起動時に呼ばれて、全テーブルを作成する関数。
    models.sqlalchemy.* を import して Base にメタデータを登録してから create_all する。
    """
    # 関数内 import にして循環 import を回避
    from models.sqlalchemy import user  # noqa: F401
    from models.sqlalchemy import seat_regist  # noqa: F401
    from models.sqlalchemy import office  # noqa: F401
    from models.sqlalchemy import pasokon  # noqa: F401
    from models.sqlalchemy import pasokon_tags  # noqa: F401
    from models.sqlalchemy import seat_reservation  # noqa: F401
    from models.sqlalchemy import tag  # noqa: F401

    Base.metadata.create_all(bind=engine)

