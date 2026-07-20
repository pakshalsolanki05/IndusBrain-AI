from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.services.search_service import global_search

from app.security.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/search",
    tags=["Global Search"],
)


class SearchRequest(BaseModel):
    question: str


@router.post("/")
def search(
    request: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return global_search(
        question=request.question,
        db=db,
        owner_id=current_user.id,
    )