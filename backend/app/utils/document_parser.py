import fitz
from docx import Document


def parse_pdf(filepath: str):

    doc = fitz.open(filepath)

    full_text = ""

    page_texts = []

    for index, page in enumerate(doc):

        text = page.get_text()

        full_text += text + "\n"

        page_texts.append(
            {
                "page": index + 1,
                "text": text,
            }
        )

    return {
        "pages": len(doc),
        "text": full_text,
        "page_texts": page_texts,
    }


def parse_docx(filepath: str):

    document = Document(filepath)

    text = "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
    )

    return {
        "pages": 1,
        "text": text,
        "page_texts": [
            {
                "page": 1,
                "text": text,
            }
        ],
    }


def parse_txt(filepath: str):

    with open(
        filepath,
        "r",
        encoding="utf-8",
    ) as file:

        text = file.read()

    return {
        "pages": 1,
        "text": text,
        "page_texts": [
            {
                "page": 1,
                "text": text,
            }
        ],
    }


def parse_document(filepath: str):

    extension = filepath.split(".")[-1].lower()

    if extension == "pdf":

        data = parse_pdf(filepath)

    elif extension == "docx":

        data = parse_docx(filepath)

    elif extension == "txt":

        data = parse_txt(filepath)

    else:

        raise ValueError(
            "Unsupported file type."
        )

    text = data["text"]

    return {

        "pages": data["pages"],

        "characters": len(text),

        "words": len(text.split()),

        "preview": text[:500],

        "text": text,

        "page_texts": data["page_texts"],

    }