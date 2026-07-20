from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base
from sqlalchemy import Float

class Entity(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, index=True)

    document_id = Column(
        Integer,
        ForeignKey("documents.id"),
        nullable=False,
    )

    document = relationship(
        "Document",
        back_populates="entities",
    )

    entity = Column(
        String,
        nullable=False,
    )

    entity_type = Column(
        String,
        nullable=False,
    )

    value = Column(
        String,
        nullable=True,
    )
    confidence = Column(
    Float,
    default=1.0,
    )