from app.services.embedding_service import chunk_document
from app.services.vector_store import add_chunks

sample = """
Pump P-101 requires lubrication every 30 days.

The bearing temperature must remain below 80°C.

Inspect shaft alignment before startup.

Check oil level before operation.

Replace worn bearings immediately.
""" * 20

chunks = chunk_document(sample)

stored = add_chunks(
    "Pump_Manual.pdf",
    chunks
)

print(f"Stored {stored} chunks successfully.")