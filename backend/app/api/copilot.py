from fastapi import APIRouter, Depends

from app.models.user import User
from app.schemas.copilot import (
    CopilotRequest,
    CopilotResponse,
)
from app.security.dependencies import get_current_user
from app.services.copilot_service import (
    generate_copilot_answer,
)

router = APIRouter(
    prefix="/copilot",
    tags=["AI Copilot"],
)


@router.post(
    "/chat",
    response_model=CopilotResponse,
)
def chat(
    request: CopilotRequest,
    current_user: User = Depends(get_current_user),
):
    return generate_copilot_answer(
        request.question,
        current_user.id,
    )