from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage


def save_message(
    db: Session,
    document_id: int,
    role: str,
    content: str,
):

    message = ChatMessage(
        document_id=document_id,
        role=role,
        content=content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def get_messages(
    db: Session,
    document_id: int,
):

    return (
        db.query(ChatMessage)
        .filter(
            ChatMessage.document_id == document_id
        )
        .order_by(ChatMessage.created_at.asc())
        .all()
    )


def delete_messages(
    db: Session,
    document_id: int,
):

    messages = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.document_id == document_id
        )
        .all()
    )

    for message in messages:
        db.delete(message)

    db.commit()