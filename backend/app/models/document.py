from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from app.database.database import Base


class Document(Base):

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )
    owner = relationship(
        "User",
    )
    filename = Column(String, nullable=False)
    filepath = Column(String)
    file_type = Column(String)
    size_kb = Column(String)
    pages = Column(Integer)
    words = Column(Integer)
    characters = Column(Integer)
    preview = Column(String)

    messages = relationship(
        "ChatMessage",
        back_populates="document",
        cascade="all, delete-orphan",
    )
    entities = relationship(
        "Entity",
        back_populates="document",
        cascade="all, delete-orphan",
    )
    analysis = relationship(
    "Analysis",
    uselist=False,
    cascade="all, delete-orphan",
    )

    relationships = relationship(
        "Relationship",
        back_populates="document",
        cascade="all, delete-orphan",
    )