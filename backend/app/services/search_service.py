from app.services.retriever import search_documents
from app.services.llm_service import ask_llm
from sqlalchemy.orm import Session
from app.repositories.document_repository import (
    get_document_by_filename,
)

def global_search(
    question: str,
    db: Session,
    owner_id: int,
    top_k: int = 8,
):
    """
    Search across every uploaded document and
    generate a concise AI summary.
    """

    results = search_documents(
        question,
        owner_id=owner_id,
        top_k=top_k,
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    if len(documents) == 0:
        return {
            "summary": "No relevant information found.",
            "results": [],
        }

    context = "\n\n".join(documents)

    summary = ask_llm(
        question=f"""
Search Query:
{question}

Provide a concise answer using the retrieved information.
Mention if multiple documents agree or disagree.
""",
        context=context,
    )

    search_results = []

    for text, meta in zip(documents, metadatas):
        doc = get_document_by_filename(
            db,
            meta.get("document"),
        )
        search_results.append(
            {
                "document": meta.get("document"),
                "document_id": doc.id if doc else None,
                "page": meta.get("page"),
                "chunk": meta.get("chunk"),
                "text": text,
            }
        )

    return {
        "summary": summary,
        "results": search_results,
    }