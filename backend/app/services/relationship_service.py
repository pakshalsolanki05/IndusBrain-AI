from sqlalchemy.orm import Session

from app.models.relationship import Relationship


def save_relationships(
    db: Session,
    document_id: int,
    relationships: list,
):

    if not relationships:
        return

    for item in relationships:

        db.add(
            Relationship(
                document_id=document_id,
                source=item["source"],
                source_type=item.get(
                    "source_type",
                    "Entity",
                ),
                relation=item["relation"],
                target=item["target"],
                target_type=item.get(
                    "target_type",
                    "Entity",
                ),
                confidence=item.get(
                    "confidence",
                    1.0,
                ),
            )
        )

    db.commit()


def get_document_relationships(
    db: Session,
    document_id: int,
):

    rows = (
        db.query(Relationship)
        .filter(
            Relationship.document_id == document_id
        )
        .all()
    )

    return [
        {
            "id": r.id,
            "source": r.source,
            "source_type": r.source_type,
            "relation": r.relation,
            "target": r.target,
            "target_type": r.target_type,
            "confidence": r.confidence,
        }
        for r in rows
    ]