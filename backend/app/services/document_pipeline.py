from app.utils.document_parser import parse_document
from app.services.entity_extractor import extract_entities
from app.services.embedding_service import (
    chunk_document_with_pages,
)
from app.services.vector_store import add_chunks
import os


def process_document(
    filepath: str,
    owner_id: int,
):
    """
    Complete document processing pipeline.
    """

    metadata = parse_document(filepath)

    text = metadata["text"]

    entities = extract_entities(text)

    print("=" * 50)
    print("TEXT PREVIEW:")
    print(text[:1000])
    print("=" * 50)

    print("EXTRACTED ENTITIES:")
    print(entities)
    print("=" * 50)

    # -----------------------------
# Create page-aware vector embeddings
# -----------------------------

    page_chunks = chunk_document_with_pages(
        metadata["page_texts"]
    )

    chunks = [
        chunk["text"]
        for chunk in page_chunks
    ]

    pages = [
        chunk["page"]
        for chunk in page_chunks
    ]

    add_chunks(
        document_name=os.path.basename(filepath),
        owner_id=owner_id,
        chunks=chunks,
        pages=pages,
    )

    return {
        "metadata": metadata,
        "text": text,
        "entities": entities,
    }