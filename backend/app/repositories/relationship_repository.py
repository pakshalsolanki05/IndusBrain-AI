from sqlalchemy.orm import Session

from app.models.relationship import Relationship


def save_relationships(
    db: Session,
    document_id: int,
    relationships: list,
):
    """
    Save extracted relationships.
    """

    for item in relationships:

        db.add(
            Relationship(
                document_id=document_id,
                source=item["source"],
                relation=item["relation"],
                target=item["target"],
                confidence=item.get(
                    "confidence",
                    1.0,
                ),
            )
        )

    db.commit()


def get_relationships(
    db: Session,
    document_id: int,
):
    return (
        db.query(Relationship)
        .filter(
            Relationship.document_id == document_id
        )
        .all()
    )