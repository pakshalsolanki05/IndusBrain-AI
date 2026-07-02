from app.services.embedding_service import chunk_document

sample = """
Pump P-101 requires inspection every 30 days.

The maintenance engineer must inspect:

- Bearings
- Shaft Alignment
- Oil Level
- Vibration

Failure to inspect may result in overheating.
""" * 30

chunks = chunk_document(sample)

print(f"Chunks Created: {len(chunks)}")

for i, chunk in enumerate(chunks):
    print("-" * 40)
    print(f"Chunk {i+1}")
    print(chunk[:200])