from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.document import Document


def get_dashboard_data(
    db: Session,
    owner_id: int,
):

    documents = (
        db.query(Document)
        .filter(Document.owner_id == owner_id)
    )

    total_documents = documents.count()

    total_pages = (
        documents.with_entities(
            func.sum(Document.pages)
        ).scalar()
        or 0
    )

    total_words = (
        documents.with_entities(
            func.sum(Document.words)
        ).scalar()
        or 0
    )

    total_characters = (
        documents.with_entities(
            func.sum(Document.characters)
        ).scalar()
        or 0
    )

    total_storage = (
        documents.with_entities(
            func.sum(Document.size_kb)
        ).scalar()
        or 0
    )

    recent_documents = (
        documents.order_by(Document.id.desc())
        .limit(5)
        .all()
    )
    top_documents = (
        documents.order_by(Document.words.desc())
        .limit(5)
        .all()
    )

    average_pages = (
        round(total_pages / total_documents, 1)
        if total_documents > 0
        else 0
    )

    largest_document = (
        documents.order_by(Document.size_kb.desc())
        .first()
    )

    return {
        "documents": total_documents,
        "pages": total_pages,
        "words": total_words,
        "characters": total_characters,
        "storage_mb": round(float(total_storage) / 1024, 2),
        "average_pages": average_pages,
        "recent_documents": recent_documents,
        "top_documents": top_documents,
        "largest_document": largest_document,
    }