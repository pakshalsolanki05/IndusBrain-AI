from sqlalchemy.orm import Session

from app.models.entity import Entity


def save_entities(
    db: Session,
    document_id: int,
    entities: list,
):
    """
    Save extracted entities for a document.
    """

    if not entities:
        return

    for item in entities:

        db.add(
            Entity(
                document_id=document_id,
                entity=item["entity"],
                entity_type=item["entity_type"],
                value=item["value"],
                confidence=item.get(
                    "confidence",
                    1.0,
                ),
            )
        )

    db.commit()


def get_document_entities(
    db: Session,
    document_id: int,
):
    """
    Return all entities for a specific document.
    """

    entities = (
        db.query(Entity)
        .filter(
            Entity.document_id == document_id
        )
        .order_by(Entity.entity_type, Entity.entity)
        .all()
    )

    return [
        {
            "id": entity.id,
            "entity": entity.entity,
            "entity_type": entity.entity_type,
            "value": entity.value,
            "confidence": entity.confidence,
        }
        for entity in entities
    ]