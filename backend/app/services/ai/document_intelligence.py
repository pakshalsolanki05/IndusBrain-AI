import re

from sqlalchemy.orm import Session

from app.models.document import Document

from app.services.ai.document_analyzer import analyze_document

from app.repositories.analysis_repository import save_analysis
from app.repositories.relationship_repository import save_relationships

from app.services.entity_service import save_entities


# ---------------------------------------------------------
# Allowed Knowledge Graph entity types
# ---------------------------------------------------------

ALLOWED_ENTITY_TYPES = {
    "Person",
    "Organization",
    "Location",
    "Date",
    "Money",
    "Percentage",
    "Product",
    "Product Category",
    "Technology",
    "Software",
    "AI Model",
    "Dataset",
    "Equipment",
    "Machine",
    "Component",
    "Process",
    "Department",
    "Business Metric",
    "Healthcare Organization",
    "Medical Term",
    "Research Paper",
    "Other",
}


# ---------------------------------------------------------
# Known entity corrections
# ---------------------------------------------------------

ENTITY_TYPE_CORRECTIONS = {

    # Software

    "streamlit": "Software",
    "tensorflow": "Software",
    "keras": "Software",
    "tableau": "Software",
    "power bi": "Software",

    # Technologies

    "python": "Technology",
    "artificial intelligence": "Technology",
    "machine learning": "Technology",
    "deep learning": "Technology",

    # AI Models / Algorithms

    "yolo": "AI Model",
    "xgboost": "AI Model",
    "cnn": "AI Model",
    "convolutional neural network": "AI Model",
    "convolutional neural networks": "AI Model",
    "random forest": "AI Model",
    "sarima": "AI Model",
    "k-means": "AI Model",
    "kmeans": "AI Model",
}


# ---------------------------------------------------------
# Generic garbage entities to ignore
# ---------------------------------------------------------

IGNORED_ENTITIES = {
    "first",
    "second",
    "third",
    "three",
    "four",
    "dataset",
    "context",
    "performance",
    "chapter",
    "abstract",
    "introduction",
    "conclusion",
}


def clean_entity_name(name: str) -> str:
    """
    Normalize entity names.
    """

    if not name:
        return ""

    # Replace newlines/tabs with spaces
    name = re.sub(
        r"\s+",
        " ",
        str(name),
    )

    return name.strip()


def is_valid_entity(name: str) -> bool:
    """
    Reject obvious garbage entities.
    """

    if not name:
        return False

    normalized = name.lower().strip()

    # Ignore generic entities
    if normalized in IGNORED_ENTITIES:
        return False

    # Reject pure numbers
    if re.fullmatch(
        r"\d+",
        normalized,
    ):
        return False

    # Reject section numbers
    if re.fullmatch(
        r"\d+(\.\d+)+",
        normalized,
    ):
        return False

    # Reject page ranges
    if re.fullmatch(
        r"\d+\s*[-–]\s*\d+",
        normalized,
    ):
        return False

    # Reject chapter headings
    if normalized.startswith("chapter "):
        return False

    # Reject extremely long entities
    if len(name) > 100:
        return False

    return True


def normalize_entity_type(
    name: str,
    entity_type: str,
) -> str:
    """
    Correct common LLM classification mistakes.
    """

    normalized_name = name.lower().strip()

    # Apply known corrections
    if normalized_name in ENTITY_TYPE_CORRECTIONS:
        return ENTITY_TYPE_CORRECTIONS[
            normalized_name
        ]

    # Validate type
    if entity_type not in ALLOWED_ENTITY_TYPES:
        return "Other"

    return entity_type


def normalize_entities(
    entities: list,
) -> list:
    """
    Clean, validate and deduplicate AI entities.
    """

    normalized_entities = []

    seen = set()

    for entity in entities:

        if not isinstance(entity, dict):
            continue

        name = clean_entity_name(
            entity.get(
                "entity",
                "",
            )
        )

        if not is_valid_entity(name):
            continue

        entity_type = normalize_entity_type(
            name=name,
            entity_type=entity.get(
                "type",
                "Other",
            ),
        )

        # Case-insensitive deduplication
        key = (
            name.lower(),
            entity_type.lower(),
        )

        if key in seen:
            continue

        seen.add(key)

        try:

            confidence = float(
                entity.get(
                    "confidence",
                    1.0,
                )
            )

        except (TypeError, ValueError):

            confidence = 1.0

        # Keep confidence in valid range
        confidence = max(
            0.0,
            min(
                1.0,
                confidence,
            ),
        )

        normalized_entities.append(
            {
                "entity": name,
                "entity_type": entity_type,
                "value": name,
                "confidence": confidence,
            }
        )

    return normalized_entities


def normalize_relationships(
    relationships: list,
    normalized_entities: list,
) -> list:
    """
    Clean, validate and deduplicate Knowledge Graph relationships.

    A relationship is saved only when both its source
    and target exist in the cleaned entity list.
    """

    normalized_relationships = []

    seen = set()

    # -----------------------------------------------------
    # Build lookup of valid cleaned entities
    # -----------------------------------------------------

    valid_entities = {
        entity["entity"].lower().strip(): entity["entity"]
        for entity in normalized_entities
    }

    for relationship in relationships:

        if not isinstance(
            relationship,
            dict,
        ):
            continue

        source = clean_entity_name(
            relationship.get(
                "source",
                "",
            )
        )

        target = clean_entity_name(
            relationship.get(
                "target",
                "",
            )
        )

        relation = clean_entity_name(
            relationship.get(
                "relation",
                "",
            )
        )

        # -------------------------------------------------
        # Basic validation
        # -------------------------------------------------

        if not source:
            continue

        if not target:
            continue

        if not relation:
            continue

        if source.lower() == target.lower():
            continue

        if not is_valid_entity(source):
            continue

        if not is_valid_entity(target):
            continue

        # -------------------------------------------------
        # Entity validation
        #
        # Both source and target MUST exist in the cleaned
        # entity list.
        # -------------------------------------------------

        source_key = source.lower().strip()
        target_key = target.lower().strip()

        if source_key not in valid_entities:

            print(
                f"⚠ Skipping relationship: "
                f"source entity '{source}' "
                f"was not found in cleaned entities."
            )

            continue

        if target_key not in valid_entities:

            print(
                f"⚠ Skipping relationship: "
                f"target entity '{target}' "
                f"was not found in cleaned entities."
            )

            continue

        # Use canonical entity names from cleaned entities
        source = valid_entities[source_key]
        target = valid_entities[target_key]

        # -------------------------------------------------
        # Normalize relationship name
        # -------------------------------------------------

        relation = (
            relation
            .lower()
            .replace(" ", "_")
            .replace("-", "_")
        )

        relation = re.sub(
            r"_+",
            "_",
            relation,
        )

        relation = relation.strip("_")

        if not relation:
            continue

        # -------------------------------------------------
        # Deduplicate relationships
        # -------------------------------------------------

        key = (
            source.lower(),
            relation,
            target.lower(),
        )

        if key in seen:
            continue

        seen.add(key)

        # -------------------------------------------------
        # Normalize confidence
        # -------------------------------------------------

        try:

            confidence = float(
                relationship.get(
                    "confidence",
                    1.0,
                )
            )

        except (TypeError, ValueError):

            confidence = 1.0

        confidence = max(
            0.0,
            min(
                1.0,
                confidence,
            ),
        )

        normalized_relationships.append(
            {
                "source": source,
                "relation": relation,
                "target": target,
                "confidence": confidence,
            }
        )

    return normalized_relationships


def run_document_intelligence(
    db: Session,
    document: Document,
    text: str,
):
    """
    Complete IndusBrain AI Document Intelligence Pipeline.

    Pipeline:

    1. Analyze document with LLM
    2. Normalize entities
    3. Correct entity classifications
    4. Remove invalid entities
    5. Deduplicate entities
    6. Normalize relationships
    7. Remove invalid relationships
    8. Save analysis
    9. Save entities
    10. Save relationships
    """

    try:

        analysis = analyze_document(
            text
        )

    except Exception as e:

        print("=" * 60)
        print("DOCUMENT INTELLIGENCE FAILED")
        print(e)
        print("=" * 60)

        return None

    if not analysis:
        return None

    # -----------------------------------------------------
    # Normalize AI entities
    # -----------------------------------------------------

    normalized_entities = normalize_entities(
        analysis.get(
            "entities",
            [],
        )
    )

    # -----------------------------------------------------
    # Normalize AI relationships
    # -----------------------------------------------------

    normalized_relationships = (
        normalize_relationships(
            relationships=analysis.get(
                "relationships",
                [],
            ),
            normalized_entities=normalized_entities,
        )
    )

    # -----------------------------------------------------
    # Update analysis with clean data
    # -----------------------------------------------------

    analysis["entities"] = [
        {
            "entity": entity["entity"],
            "type": entity["entity_type"],
            "confidence": entity[
                "confidence"
            ],
        }
        for entity in normalized_entities
    ]

    analysis["relationships"] = (
        normalized_relationships
    )

    # -----------------------------------------------------
    # Save document analysis
    # -----------------------------------------------------

    save_analysis(
        db=db,
        document_id=document.id,
        analysis=analysis,
    )

    # -----------------------------------------------------
    # Save clean AI entities
    # -----------------------------------------------------

    if normalized_entities:

        save_entities(
            db=db,
            document_id=document.id,
            entities=normalized_entities,
        )

    # -----------------------------------------------------
    # Save clean AI relationships
    # -----------------------------------------------------

    if normalized_relationships:

        save_relationships(
            db=db,
            document_id=document.id,
            relationships=normalized_relationships,
        )

    print(
        f"✅ AI Intelligence: "
        f"{len(normalized_entities)} clean entities, "
        f"{len(normalized_relationships)} clean relationships"
    )

    return analysis