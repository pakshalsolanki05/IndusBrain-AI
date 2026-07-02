from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.entity_service import get_entities

router = APIRouter(
    prefix="/entities",
    tags=["Entities"],
)


@router.get("/")
def list_entities(db: Session = Depends(get_db)):
    return get_entities(db)