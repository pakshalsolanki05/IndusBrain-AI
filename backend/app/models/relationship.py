from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class Relationship(Base):

    __tablename__ = "relationships"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.id"),
        nullable=False,
    )

    document = relationship(
        "Document",
    )

    source = Column(
        String,
        nullable=False,
    )

    source_type = Column(
        String,
        default="Entity",
    )

    relation = Column(
        String,
        nullable=False,
    )

    target = Column(
        String,
        nullable=False,
    )

    target_type = Column(
        String,
        default="Entity",
    )

    confidence = Column(
        Float,
        default=1.0,
    )