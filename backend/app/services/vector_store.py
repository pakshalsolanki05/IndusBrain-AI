import chromadb
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.PersistentClient(
    path="vector_db"
)

collection = chroma_client.get_or_create_collection(
    name="industrial_documents"
)


def add_chunks(
    document_name: str,
    owner_id: int,
    chunks: list[str],
    pages: list[int],
):

    embeddings = model.encode(chunks).tolist()

    ids = []
    metadatas = []

    for index, chunk in enumerate(chunks):

        ids.append(
            f"user_{owner_id}_{document_name}_{index}"
        )

        metadatas.append(
            {
                "owner_id": owner_id,
                "document": document_name,
                "chunk": index,
                "page": pages[index],
            }
        )

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(chunks)