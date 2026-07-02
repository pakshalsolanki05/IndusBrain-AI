from sentence_transformers import SentenceTransformer
import chromadb

# Load the same embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to existing database
client = chromadb.PersistentClient(
    path="vector_db"
)

collection = client.get_collection(
    "industrial_documents"
)


def search_documents(question: str, top_k: int = 5):

    query_embedding = model.encode(question).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results