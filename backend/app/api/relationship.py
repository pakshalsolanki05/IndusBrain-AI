from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user

from app.repositories.document_repository import get_document

from app.services.relationship_service import (
    get_document_relationships,
)

router = APIRouter(
    prefix="/documents",
    tags=["Relationships"],
)


@router.get("/{document_id}/relationships")
def list_relationships(
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

    return get_document_relationships(
        db=db,
        document_id=document_id,
    )