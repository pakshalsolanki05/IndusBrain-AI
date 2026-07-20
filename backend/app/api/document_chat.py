from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from fastapi.responses import StreamingResponse

from app.database.database import get_db

from app.repositories.document_repository import (
    get_document,
    get_document_by_filename,
)

from app.repositories.chat_repository import save_message

from app.schemas.chat_schema import ChatRequest

from app.services.ai_service import (
    generate_document_answer,
    generate_document_stream,
)

from app.security.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/documents",
    tags=["Document Chat"],
)


@router.post("/{document_id}/chat")
def chat_with_document(
    document_id: int,
    request: ChatRequest,
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

    # Save user message
    save_message(
        db=db,
        document_id=document.id,
        role="user",
        content=request.question,
    )

    # AI response
    response = generate_document_answer(
        question=request.question,
        filename=document.filename,
        owner_id=current_user.id,
    )

    # Attach document IDs to returned sources
    for source in response["sources"]:

        doc = get_document_by_filename(
            db,
            source["document"],
        )

        source["document_id"] = (
            doc.id if doc else None
        )

    # Save assistant message
    save_message(
        db=db,
        document_id=document.id,
        role="assistant",
        content=response["answer"],
    )

    return response


@router.post("/{document_id}/chat/stream")
def stream_chat_with_document(
    document_id: int,
    request: ChatRequest,
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

    save_message(
        db=db,
        document_id=document.id,
        role="user",
        content=request.question,
    )

    def event_generator():

        complete_answer = ""
        sources = []

        for chunk in generate_document_stream(
            question=request.question,
            filename=document.filename,
            owner_id=current_user.id,
        ):

            if chunk["type"] == "token":

                complete_answer += chunk["content"]

                yield (
                    f"data: {json.dumps(chunk)}\n\n"
                ).encode("utf-8")

            elif chunk["type"] == "done":

                sources = chunk["sources"]

                for source in sources:

                    doc = get_document_by_filename(
                        db,
                        source["document"],
                    )

                    source["document_id"] = (
                        doc.id if doc else None
                    )

                chunk["sources"] = sources

                save_message(
                    db=db,
                    document_id=document.id,
                    role="assistant",
                    content=complete_answer,
                )

                yield (
                    f"data: {json.dumps(chunk)}\n\n"
                ).encode("utf-8")

        yield b"data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )