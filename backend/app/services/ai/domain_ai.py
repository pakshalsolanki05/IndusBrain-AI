from app.services.ai.llm_client import LLMClient
from app.services.ai.prompts import DOMAIN_SYSTEM_PROMPT


def detect_domain(text: str):
    """
    Detect the domain of a document using the LLM.
    """

    # Limit prompt size
    sample = text[:6000]

    result = LLMClient.generate_json(
        system_prompt=DOMAIN_SYSTEM_PROMPT,
        user_prompt=sample,
    )

    return result