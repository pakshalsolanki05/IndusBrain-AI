from app.services.ai.llm_client import LLMClient
from app.services.ai.prompts import DOCUMENT_ANALYZER_PROMPT


def analyze_document(text: str):
    """
    Perform complete AI analysis of a document.

    Returns:
        Domain
        Executive Summary
        Entities
        Relationships
        Insights
        Recommendations
    """

    sample = text[:12000]

    result = LLMClient.generate_json(
        system_prompt=DOCUMENT_ANALYZER_PROMPT,
        user_prompt=sample,
    )

    return result