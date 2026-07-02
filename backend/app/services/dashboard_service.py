from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.document import Document


def get_dashboard_data(db: Session):
    """
    Returns dashboard statistics.
    """

    total_documents = db.query(Document).count()

    total_pages = (
        db.query(func.sum(Document.pages))
        .scalar()
        or 0
    )

    total_words = (
        db.query(func.sum(Document.words))
        .scalar()
        or 0
    )

    total_characters = (
        db.query(func.sum(Document.characters))
        .scalar()
        or 0
    )

    total_storage = (
        db.query(func.sum(Document.size_kb))
        .scalar()
        or 0
    )

    recent_documents = (
        db.query(Document)
        .order_by(Document.id.desc())
        .limit(5)
        .all()
    )

    return {
        "documents": total_documents,
        "pages": total_pages,
        "words": total_words,
        "characters": total_characters,
        "storage_mb": round(float(total_storage) / 1024, 2),
        "recent_documents": recent_documents,
    }