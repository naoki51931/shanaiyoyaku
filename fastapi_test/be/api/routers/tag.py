from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.sqlalchemy.tags import Tag  # Tagモデルをインポート
from database.database import get_db  # データベースセッションを取得する関数
from models.pydantic.tag import TagCreate, TagUpdate, TagResponse  # Pydanticスキーマ
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter()

# タグを全て取得するエンドポイント
@router.get("/tags/", response_model=list[TagResponse])
def get_tags(db: Session = Depends(get_db)):
    try:
        tags = db.query(Tag).all()
        return tags
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="データベースエラー")

# タグを作成するエンドポイント
@router.post("/tags/", response_model=TagResponse)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    try:
        new_tag = Tag(name=tag.name)
        db.add(new_tag)
        db.commit()
        db.refresh(new_tag)
        return new_tag
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="データベースエラー")

# タグを更新するエンドポイント
@router.put("/tags/{tag_id}", response_model=TagResponse)
def update_tag(tag_id: int, tag: TagUpdate, db: Session = Depends(get_db)):
    try:
        existing_tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not existing_tag:
            raise HTTPException(status_code=404, detail="タグが見つかりません")
        
        # タグの情報を更新
        if tag.name:
            existing_tag.name = tag.name
        
        db.commit()
        db.refresh(existing_tag)
        return existing_tag
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="データベースエラー")

# タグを削除するエンドポイント
@router.delete("/tags/{tag_id}", response_model=TagResponse)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    try:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise HTTPException(status_code=404, detail="タグが見つかりません")
        
        db.delete(tag)
        db.commit()
        return tag
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="データベースエラー")
