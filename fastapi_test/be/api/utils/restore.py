from datetime import date
import subprocess
import os
import logging
from fastapi import UploadFile, File, HTTPException
import shutil
from fastapi import APIRouter
from fastapi import HTTPException
from fastapi.responses import FileResponse


BACKUP_DIR = "backup"
DB_USER = os.environ.get("DB_USER", "mysqluser")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "mysqlpass")
DB_NAME = os.environ.get("DB_NAME", "sample_db")
DB_HOST = os.environ.get("DB_HOST", "db")  # ← コンテナ名
DB_PORT = os.environ.get("DB_PORT", "3308")  # コンテナ内では3306でアクセス

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def backup_today():
    today = date.today().isoformat()
    filename = f"{today}.sql"
    filepath = os.path.join(BACKUP_DIR, filename)
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    cmd = f"mysqldump -h{DB_HOST} -P{DB_PORT} -u{DB_USER} -p{DB_PASSWORD} {DB_NAME} > {filepath}"
    logger.info(f"[実行コマンド] {cmd}")  # ← こちらを使用
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        logger.error("バックアップに失敗しました")
    else:
        logger.info(f"バックアップ成功: {filepath}")


router = APIRouter()

@router.get("/backups")
def list_backups():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR, exist_ok=True)
        return []  # or raise HTTPException(status_code=404, detail="バックアップディレクトリが存在しません")

    files = os.listdir(BACKUP_DIR)
    return sorted([f for f in files if f.endswith(".sql")])



@router.get("/download/{filename}")
def download_backup(filename: str):
    filepath = os.path.join("backup", filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="ファイルが存在しません")
    return FileResponse(filepath, media_type="application/sql", filename=filename)

@router.post("/restore/upload")
def upload_and_restore_backup(file: UploadFile = File(...)):
    filename = file.filename
    filepath = os.path.join("backup", filename)
    
    logging.info(f"Looking for backup file at: {filepath}")
    logging.info("ここまで実行済み")
    os.makedirs("backup", exist_ok=True)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # リストア処理（mysqldumpの逆）
    cmd = f"mysql -h{DB_HOST} -P{DB_PORT} -u{DB_USER} -p{DB_PASSWORD} {DB_NAME} < {filepath}"
    result = subprocess.run(cmd, shell=True)
    
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail="リストアに失敗しました")
    
    return {"message": "アップロード＆リストア成功"}


@router.post("/restore/{filename}")
def restore_backup(filename: str):
    filepath = os.path.join("backup", filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="バックアップが見つかりません")
    
    cmd = f"mysql -h{DB_HOST} -P{DB_PORT} -u{DB_USER} -p{DB_PASSWORD} {DB_NAME} < {filepath}"
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail="リストアに失敗しました")
    
    return {"message": "リストア成功"}

#-----------------------------
@router.get("/backup/test")
def test_backup():
    backup_today()
    return {"message": "バックアップ関数を実行しました"}
#-----------------------------