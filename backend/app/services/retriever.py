from sentence_transformers import SentenceTransformer
import chromadb

from app.services.llm_service import ask_llm

model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(
    path="vector_db"
)

collection = client.get_collection(
    "industrial_documents"
)


def search_documents(
    question: str,
    owner_id: int,
    top_k: int = 3,
):

    query_embedding = model.encode(question).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={
            "owner_id": owner_id,
        },
    )

    return results


def search_document(
    question: str,
    filename: str,
    owner_id: int,
    top_k: int = 5,
):

    query_embedding = model.encode(question).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={
            "$and": [
                {
                    "document": filename,
                },
                {
                    "owner_id": owner_id,
                },
            ]
        },
    )

    return results


def get_document_chunks(
    filename: str,
    owner_id: int,
):

    results = collection.get(
        where={
            "$and": [
                {
                    "document": filename,
                },
                {
                    "owner_id": owner_id,
                },
            ]
        },
    )

    return results


# ===========================================================
# NEW FUNCTION
# ===========================================================

def generate_answer(
    question: str,
    owner_id: int,
):
    """
    Search the vector database and generate an answer
    using the Ollama LLM.
    """

    results = search_documents(
        question=question,
        owner_id=owner_id,
        top_k=3,
    )

    documents = results.get("documents", [])

    if not documents or len(documents[0]) == 0:
        return {
            "answer": "I could not find any relevant information in your uploaded documents.",
            "sources": [],
        }

    context = "\n\n".join(documents[0])

    answer = ask_llm(
        question=question,
        context=context,
    )

    metadatas = results.get("metadatas", [[]])[0]

    sources = []

    for meta in metadatas:
        if meta:
            sources.append(
                meta.get(
                    "document",
                    "Unknown Document",
                )
            )

    return {
        "answer": answer,
        "sources": list(set(sources)),
    }