from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.repositories.analysis_repository import (
    get_analysis,
)

router = APIRouter(
    prefix="/analysis",
    tags=["AI Analysis"],
)


@router.get("/{document_id}")
def analysis(
    document_id: int,
    db: Session = Depends(get_db),
):

    result = get_analysis(
        db=db,
        document_id=document_id,
    )

    if result is None:

        raise HTTPException(
            status_code=404,
            detail="Analysis not found.",
        )

    return result