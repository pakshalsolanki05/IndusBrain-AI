import chromadb
from sentence_transformers import SentenceTransformer

# Load embedding model (downloads once)
model = SentenceTransformer("all-MiniLM-L6-v2")

# Persistent ChromaDB storage
chroma_client = chromadb.PersistentClient(
    path="vector_db"
)

collection = chroma_client.get_or_create_collection(
    name="industrial_documents"
)


def add_chunks(document_name: str, chunks: list[str]):

    embeddings = model.encode(chunks).tolist()

    ids = []
    metadatas = []

    for index in range(len(chunks)):
        ids.append(f"{document_name}_{index}")

        metadatas.append(
            {
                "document": document_name,
                "chunk": index
            }
        )

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

    return len(chunks)