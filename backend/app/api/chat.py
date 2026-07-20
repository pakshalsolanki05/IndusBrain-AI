from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.chat_schema import ChatRequest
from app.security.dependencies import get_current_user
from app.models.user import User
from app.services.retriever import generate_answer

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_answer(
        question=request.question,
        owner_id=current_user.id,
    )