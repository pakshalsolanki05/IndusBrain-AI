from sqlalchemy.orm import Session
from app.models.document import Document
import os


def get_document(
    db: Session,
    document_id: int,
    owner_id: int,
):

    return (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.owner_id == owner_id,
        )
        .first()
    )


def get_document_by_filename(
    db: Session,
    filename: str,
):
    """
    Find a document using its filename.
    Used for mapping AI citations to document IDs.
    """

    return (
        db.query(Document)
        .filter(Document.filename == filename)
        .first()
    )


def create_document(db: Session, data: dict, owner_id: int,):

    existing = (
        db.query(Document)
        .filter(Document.filename == data["filename"])
        .first()
    )

    if existing:
        return existing

    document = Document(
        owner_id=owner_id,
        filename=data["filename"],
        filepath=data["filepath"],
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


def delete_document(
    db: Session,
    document_id: int,
):

    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        return None

    db.delete(document)
    db.commit()

    return document


def get_all_documents(
    db: Session,
    owner_id: int,
):

    return (
        db.query(Document)
        .filter(
            Document.owner_id == owner_id
        )
        .order_by(Document.id.desc())
        .all()
    )