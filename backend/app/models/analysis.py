from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Text,
)

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.database.database import Base


class Analysis(Base):

    __tablename__ = "analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.id"),
        nullable=False,
        unique=True,
    )

    document = relationship(
        "Document",
    )

    domain = Column(
        String,
        nullable=True,
    )

    summary = Column(
        Text,
        nullable=True,
    )

    insights = Column(
        Text,
        nullable=True,
    )

    recommendations = Column(
        Text,
        nullable=True,
    )

    analysis_version = Column(
        String,
        default="1.0",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )