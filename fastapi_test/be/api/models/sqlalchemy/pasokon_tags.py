from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base  # Base をインポートする

# class PasokonTag(Base):
#     __tablename__ = 'pasokon_tags'

#     pasokon_id = Column(Integer, ForeignKey('pasokon.id'), primary_key=True)
#     tag_id = Column(Integer, ForeignKey('tags.id'), primary_key=True)

#     pasokon = relationship("Pasokon", back_populates="pasokon_tags")
#     tag = relationship("Tag", back_populates="pasokon_tags")
pasokon_tags = Table(
    "pasokon_tags",
    Base.metadata,
    Column("pasokon_id", Integer, ForeignKey("pasokon.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)