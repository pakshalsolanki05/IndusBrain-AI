from app.utils.document_parser import parse_document
from app.services.entity_extractor import extract_entities


def process_document(filepath: str):
    """
    Complete document processing pipeline.
    """

    metadata = parse_document(filepath)

    text = metadata["text"]

    entities = extract_entities(text)

    return {
        "metadata": metadata,
        "entities": entities,
        "text": text,
    }