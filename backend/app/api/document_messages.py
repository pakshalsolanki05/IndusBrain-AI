from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.repositories.chat_repository import get_messages
from app.repositories.document_repository import get_document

from app.security.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/documents",
    tags=["Chat History"],
)


@router.get("/{document_id}/messages")
def document_messages(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # Verify the document belongs to the logged-in user
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

    messages = get_messages(
        db,
        document.id,
    )

    return messages