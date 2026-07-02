from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_document(text: str):
    """
    Split extracted document text into overlapping chunks
    suitable for vector embeddings.
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", ".", " ", ""]
    )

    chunks = splitter.split_text(text)

    return chunks