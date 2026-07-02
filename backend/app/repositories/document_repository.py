from sqlalchemy.orm import Session
from app.models.document import Document


def create_document(db: Session, data: dict):

    existing = (
        db.query(Document)
        .filter(Document.filename == data["filename"])
        .first()
    )

    if existing:
        return existing

    document = Document(
        filename=data["filename"],
        file_type=data["file_type"],
        size_kb=str(data["size_kb"]),
        pages=data["pages"],
        words=data["words"],
        characters=data["characters"],
        preview=data["preview"],
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


def get_all_documents(db: Session):

    return (
        db.query(Document)
        .order_by(Document.id.desc())
        .all()
    )