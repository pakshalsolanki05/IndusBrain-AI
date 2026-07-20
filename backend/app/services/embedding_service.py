from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=150,
    separators=[
        "\n\n",
        "\n",
        ".",
        " ",
        "",
    ],
)


def chunk_document(text: str):
    """
    Existing chunker.
    Used by older parts of the application.
    """

    return splitter.split_text(text)


def chunk_document_with_pages(page_texts):
    """
    Chunk every page individually while preserving
    the original PDF page number.

    Returns:
    [
        {
            "text": "...chunk...",
            "page": 1,
        },
        ...
    ]
    """

    page_chunks = []

    for page in page_texts:

        page_number = page["page"]

        text = page["text"]

        chunks = splitter.split_text(text)

        for chunk in chunks:

            page_chunks.append(
                {
                    "text": chunk,
                    "page": page_number,
                }
            )

    return page_chunks