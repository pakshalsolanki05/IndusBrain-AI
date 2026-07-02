import os
import shutil

from fastapi import UploadFile
from app.services.document_pipeline import process_document
from app.utils.document_parser import parse_document

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_document(file: UploadFile):

    filepath = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(filepath, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    result = process_document(filepath)

    metadata = result["metadata"]

    size = os.path.getsize(filepath) / 1024

    return {

        "filename": file.filename,

        "file_type": file.filename.split(".")[-1].upper(),

        "size_kb": round(size, 2),

        "pages": metadata["pages"],

        "characters": metadata["characters"],

        "words": metadata["words"],

        "preview": metadata["preview"],

        "message": "Document processed successfully."
    }