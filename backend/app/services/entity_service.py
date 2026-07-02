from sqlalchemy.orm import Session
from app.models.entity import Entity


def save_entities(db: Session, document: str, entities: list):
    """
    Save extracted entities into SQLite.
    """

    for item in entities:
        db.add(
            Entity(
                document=document,
                entity=item["entity"],
                entity_type=item["entity_type"],
                value=item["value"],
            )
        )

    db.commit()


def get_entities(db: Session):
    return db.query(Entity).all()