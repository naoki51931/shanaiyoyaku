from sqlalchemy.orm import Session
from models.sqlalchemy.pasokon import Pasokon  # モデル名は適宜合わせてください


def change_pasokon_status(db: Session, pasokon_id: int, new_status: str):
    pasokon = db.query(DBPasokon).filter(DBPasokon.id == pasokon_id).first()
    if pasokon:
        pasokon.in_active = new_status
        db.commit()