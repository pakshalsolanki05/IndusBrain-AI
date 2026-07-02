from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.document_repository import create_document
from app.services.document_service import save_document

router = APIRouter(
    prefix="/upload",
    tags=["Document Upload"]
)


@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    metadata = save_document(file)

    create_document(db, metadata)

    return metadata