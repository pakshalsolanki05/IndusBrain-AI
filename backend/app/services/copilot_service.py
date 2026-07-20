from app.services.retriever import search_documents

from app.services.ai.llm_client import LLMClient

def generate_copilot_answer(
    question: str,
    owner_id: int,
):
    results = search_documents(
        question=question,
        owner_id=owner_id,
        top_k=8,
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    if not documents:
        return {
            "answer": "I couldn't find relevant information in your uploaded documents.",
            "sources": [],
        }

    context_parts = []

    for document, metadata in zip(documents, metadatas):

        context_parts.append(
            f"""
    Document: {metadata.get("document")}
    Chunk: {metadata.get("chunk_number")}

    Content:
    {document}
    """
        )

    context = "\n\n".join(context_parts)

    prompt = f"""
    You have retrieved information from multiple enterprise documents.

    Question:
    {question}

    Retrieved Context:
    {context}

    Instructions:

    1. Answer only using the retrieved context.
    2. Combine information from multiple documents when appropriate.
    3. Do not invent facts.
    4. If information conflicts, mention the conflict.
    5. If information is missing, clearly state that.
    6. Write a professional enterprise answer.
    """

    answer = LLMClient.generate(
        system_prompt="""
    You are IndusBrain AI, an enterprise knowledge copilot.

    Answer ONLY using the retrieved document context.

    If the information is not present in the context,
    say so clearly.

    When information comes from multiple documents,
    combine it into one coherent answer.
    """,
        user_prompt=prompt,
    )

    sources = []

    seen = set()

    for metadata in metadatas:

        filename = metadata.get("document")

        if filename in seen:
            continue

        seen.add(filename)

        sources.append(
            {
                "document": filename,
                "chunk": metadata.get("chunk_number"),
            }
        )

    return {
        "answer": answer,
        "sources": sources,
    }