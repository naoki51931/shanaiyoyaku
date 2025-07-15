from sqlalchemy.orm import Session
from models.sqlalchemy.pasokon import Pasokon  # モデル名は適宜合わせてください
from datetime import date
import subprocess
import os
from fastapi import APIRouter
from fastapi import HTTPException
from fastapi.responses import FileResponse

def change_pasokon_status(db: Session, pasokon_id: int, new_status: str):
    pasokon = db.query(Pasokon).filter(Pasokon.id == pasokon_id).first()
    if pasokon:
        pasokon.in_active = new_status
        db.commit()


BACKUP_DIR = "backup"
DB_USER = "root"
DB_PASSWORD = "rootpass"
DB_NAME = "sample_db"
DB_HOST = "172.17.0.1:3308"

def backup_today():
    today = date.today().isoformat()
    filename = f"{today}.sql"
    filepath = os.path.join(BACKUP_DIR, filename)
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    cmd = f"mysqldump -h{DB_HOST} -u{DB_USER} -p{DB_PASSWORD} {DB_NAME} > {filepath}"
    subprocess.run(cmd, shell=True)

router = APIRouter()

@router.get("/backups")
def list_backups():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR, exist_ok=True)
        return []  # or raise HTTPException(status_code=404, detail="バックアップディレクトリが存在しません")

    files = os.listdir(BACKUP_DIR)
    return sorted([f for f in files if f.endswith(".sql")])


@router.post("/restore/{filename}")
def restore_backup(filename: str):
    filepath = os.path.join("backup", filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="バックアップが見つかりません")
    
    cmd = f"mysql -u{DB_USER} -p{DB_PASSWORD} {DB_NAME} < {filepath}"
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail="リストアに失敗しました")
    
    return {"message": "リストア成功"}




@router.get("/download/{filename}")
def download_backup(filename: str):
    filepath = os.path.join("backup", filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="ファイルが存在しません")
    return FileResponse(filepath, media_type="application/sql", filename=filename)