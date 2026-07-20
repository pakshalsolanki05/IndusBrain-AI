from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.repositories.analysis_repository import get_analysis
from app.database.database import get_db

from app.repositories.document_repository import (
    get_all_documents,
    get_document,
    delete_document,
)

from app.security.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.get("/")
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_documents(
        db,
        current_user.id,
    )


@router.get("/{document_id}")
def get_document_by_id(
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
            detail="Document not found."
        )

    return document


@router.delete("/{document_id}")
def remove_document(
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
            detail="Document not found."
        )

    delete_document(
        db,
        document.id,
    )

    return {
        "message": "Document deleted successfully."
    }

@router.get("/{document_id}/analysis")
def document_analysis(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    analysis = get_analysis(
        db=db,
        document_id=document_id,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found.",
        )

    return analysis