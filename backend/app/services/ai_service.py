from app.services.retriever import (
    search_documents,
    search_document,
)

from app.services.llm_service import (
    ask_llm,
    stream_llm,
)


def generate_answer(
    question: str,
    owner_id: int,
):
    """
    AI chat across ALL documents
    owned by the current user.
    """

    results = search_documents(
        question=question,
        owner_id=owner_id,
    )

    documents = results["documents"][0]

    if len(documents) == 0:
        return {
            "answer": "I could not find relevant information in your uploaded documents.",
            "sources": [],
        }

    context = "\n\n".join(documents)

    answer = ask_llm(
        question=question,
        context=context,
    )

    unique_sources = []
    seen = set()

    for source in results["metadatas"][0]:

        key = (
            source["document"],
            source.get("chunk"),
        )

        if key not in seen:

            seen.add(key)

            unique_sources.append(source)

    return {
        "answer": answer,
        "sources": unique_sources,
    }


def generate_document_answer(
    question: str,
    filename: str,
    owner_id: int,
):
    """
    Chat with ONE document.
    """

    results = search_document(
        question=question,
        filename=filename,
        owner_id=owner_id,
    )

    documents = results["documents"][0]

    if len(documents) == 0:
        return {
            "answer": "I could not find relevant information in this document.",
            "sources": [],
        }

    context = "\n\n".join(documents)

    answer = ask_llm(
        question=question,
        context=context,
    )

    unique_sources = []
    seen = set()

    for source in results["metadatas"][0]:

        key = (
            source["document"],
            source.get("chunk"),
        )

        if key not in seen:

            seen.add(key)

            unique_sources.append(
                {
                    "document": source["document"],
                    "chunk": source.get("chunk"),
                    "page": source.get("page"),
                }
            )

    return {
        "answer": answer,
        "sources": unique_sources,
    }


def generate_document_stream(
    question: str,
    filename: str,
    owner_id: int,
):
    """
    Streaming document chat.
    """

    results = search_document(
        question=question,
        filename=filename,
        owner_id=owner_id,
    )

    documents = results["documents"][0]

    if len(documents) == 0:

        yield {
            "type": "error",
            "content": "I could not find relevant information in this document.",
        }

        return

    context = "\n\n".join(documents)

    complete_answer = ""

    for token in stream_llm(
        question=question,
        context=context,
    ):

        complete_answer += token

        yield {
            "type": "token",
            "content": token,
        }

    unique_sources = []
    seen = set()

    for source in results["metadatas"][0]:

        key = (
            source["document"],
            source.get("chunk"),
        )

        if key not in seen:

            seen.add(key)

            unique_sources.append(
                {
                    "document": source["document"],
                    "chunk": source.get("chunk"),
                    "page": source.get("page"),
                }
            )

    yield {
        "type": "done",
        "answer": complete_answer,
        "sources": unique_sources,
    }