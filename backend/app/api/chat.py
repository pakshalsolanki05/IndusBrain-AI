from fastapi import APIRouter

from app.schemas.chat_schema import ChatRequest
from app.services.ai_service import generate_answer

router = APIRouter(
    prefix="/chat",
    tags=["AI Copilot"]
)


@router.post("/")
def chat(request: ChatRequest):

    return generate_answer(request.question)