from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.document_repository import get_document
from app.services.summary_service import generate_summary

from app.security.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/documents",
    tags=["Document Summary"]
)


@router.post("/{document_id}/summary")
def summarize_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    document = get_document(
        db,
        document_id,
        current_user.id,
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    return generate_summary(
        document.filename
    )