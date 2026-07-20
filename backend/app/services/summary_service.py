from app.services.retriever import get_document_chunks
from app.services.llm_service import ask_llm


def generate_summary(filename: str):

    results = get_document_chunks(filename)

    documents = results["documents"]

    if not documents:

        return {
            "summary": "No content found."
        }

    context = "\n\n".join(documents)

    prompt = f"""
You are an expert document analyst.

Read the following document and produce a structured summary.

Return exactly this format:

# Executive Summary

# Objectives

# Key Topics

# Important Findings

# Recommendations

Document:

{context}
"""

    summary = ask_llm(

        question=prompt,

        context=context,

    )

    return {

        "summary": summary

    }