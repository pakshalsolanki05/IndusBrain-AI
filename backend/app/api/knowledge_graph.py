from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.entity import Entity
from app.models.relationship import Relationship
from app.models.document import Document
from app.models.user import User

from app.security.dependencies import get_current_user


router = APIRouter(
    prefix="/knowledge-graph",
    tags=["Knowledge Graph"],
)


@router.get("/")
def get_graph(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Build a global Knowledge Graph using all documents
    owned by the currently authenticated user.

    The graph combines:

    - Entities from all user documents
    - Relationships from all user documents
    - Duplicate entities are merged
    - Duplicate relationships are removed
    """

    # -----------------------------------------------------
    # Get all documents belonging to current user
    # -----------------------------------------------------

    documents = (
        db.query(Document)
        .filter(
            Document.owner_id == current_user.id
        )
        .all()
    )

    document_ids = [
        document.id
        for document in documents
    ]

    # -----------------------------------------------------
    # No documents
    # -----------------------------------------------------

    if not document_ids:

        return {
            "nodes": [],
            "edges": [],
            "stats": {
                "documents": 0,
                "entities": 0,
                "relationships": 0,
            },
        }

    # -----------------------------------------------------
    # Get entities belonging to user's documents
    # -----------------------------------------------------

    entities = (
        db.query(Entity)
        .filter(
            Entity.document_id.in_(
                document_ids
            )
        )
        .all()
    )

    # -----------------------------------------------------
    # Get relationships belonging to user's documents
    # -----------------------------------------------------

    relationships = (
        db.query(Relationship)
        .filter(
            Relationship.document_id.in_(
                document_ids
            )
        )
        .all()
    )

    # -----------------------------------------------------
    # Build unique entity nodes
    # -----------------------------------------------------

    nodes = []

    entity_map = {}

    for entity in entities:

        entity_name = (
            entity.entity
            .strip()
        )

        if not entity_name:
            continue

        entity_key = (
            entity_name
            .lower()
        )

        # Merge duplicate entities
        if entity_key in entity_map:
            continue

        node_id = f"entity-{len(entity_map) + 1}"

        entity_map[
            entity_key
        ] = node_id

        nodes.append(
            {
                "id": node_id,

                "type": "default",

                "position": {
                    "x": 0,
                    "y": 0,
                },

                "data": {
                    "label": entity_name,
                    "type": entity.entity_type,
                },
            }
        )

    # -----------------------------------------------------
    # Build relationship edges
    # -----------------------------------------------------

    edges = []

    seen_relationships = set()

    for relationship in relationships:

        source_name = (
            relationship.source
            .strip()
        )

        target_name = (
            relationship.target
            .strip()
        )

        relation_name = (
            relationship.relation
            .strip()
        )

        if not source_name:
            continue

        if not target_name:
            continue

        if not relation_name:
            continue

        source_key = (
            source_name
            .lower()
        )

        target_key = (
            target_name
            .lower()
        )

        # -------------------------------------------------
        # Both relationship endpoints must exist
        # as valid graph entities
        # -------------------------------------------------

        if source_key not in entity_map:
            continue

        if target_key not in entity_map:
            continue

        source_id = entity_map[
            source_key
        ]

        target_id = entity_map[
            target_key
        ]

        # -------------------------------------------------
        # Prevent duplicate edges
        # -------------------------------------------------

        relationship_key = (
            source_key,
            relation_name.lower(),
            target_key,
        )

        if relationship_key in seen_relationships:
            continue

        seen_relationships.add(
            relationship_key
        )

        edges.append(
            {
                "id": f"edge-{len(edges) + 1}",

                "source": source_id,

                "target": target_id,

                "label": relation_name,

                "type": "smoothstep",

                "animated": True,

                "data": {
                    "relation": relation_name,
                    "confidence": relationship.confidence,
                    "document_id": relationship.document_id,
                },
            }
        )

    # -----------------------------------------------------
    # Return Global Knowledge Graph
    # -----------------------------------------------------

    return {
        "nodes": nodes,

        "edges": edges,

        "stats": {
            "documents": len(
                document_ids
            ),

            "entities": len(
                nodes
            ),

            "relationships": len(
                edges
            ),
        },
    }