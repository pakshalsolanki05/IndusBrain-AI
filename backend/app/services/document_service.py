import os
import shutil

from fastapi import UploadFile

from app.services.document_pipeline import process_document

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_document(
    file: UploadFile,
    owner_id: int,
):
    """
    Save uploaded file to disk, process it, and return
    both document metadata and extracted entities.

    Note:
    Entities are NOT saved here because the document ID
    does not exist yet. They will be saved after the
    document is created in the database.
    """

    filepath = os.path.join(
        UPLOAD_DIR,
        file.filename,
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    # Process document
    result = process_document(
        filepath=filepath,
        owner_id=owner_id,
    )

    metadata = result["metadata"]
    text = result["text"]
    entities = result["entities"]

    size = os.path.getsize(filepath) / 1024

    document_metadata = {
        "filename": file.filename,
        "filepath": filepath,
        "file_type": file.filename.split(".")[-1].upper(),
        "size_kb": round(size, 2),
        "pages": metadata["pages"],
        "characters": metadata["characters"],
        "words": metadata["words"],
        "preview": metadata["preview"],
        "message": "Document processed successfully.",
    }

    return {
        "metadata": document_metadata,
        "entities": entities,
        "text": text,
    }