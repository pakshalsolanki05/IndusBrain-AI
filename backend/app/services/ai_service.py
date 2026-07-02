from app.services.retriever import search_documents


def generate_answer(question: str):

    results = search_documents(question)

    documents = results["documents"][0]

    if len(documents) == 0:
        return {
            "answer": "I could not find relevant information in the uploaded documents.",
            "sources": []
        }

    context = "\n\n".join(documents)

    answer = f"""
Question:
{question}

Based on the uploaded industrial documents:

{context}

This answer was generated using the document knowledge base.
"""

    return {
        "answer": answer.strip(),
        "sources": results["metadatas"][0]
    }