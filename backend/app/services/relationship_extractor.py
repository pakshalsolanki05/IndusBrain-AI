from app.services.ai.llm_client import LLMClient

SYSTEM_PROMPT = """
You are an expert Knowledge Graph extraction engine.

Extract relationships between important entities.

Return ONLY JSON.

{
  "relationships":[
    {
      "source":"CNN",

      "source_type":"Technology",

      "relation":"implemented_using",

      "target":"TensorFlow",

      "target_type":"Technology",

      "confidence":0.98
    }
  ]
}

Rules

Return at most 25 relationships.

Ignore weak relationships.

Do not invent entities.

Never return markdown.

Return JSON only.
"""


def extract_relationships(text: str):
    """
    Extract semantic relationships using Ollama.
    """

    sample = text[:12000]

    try:

        result = LLMClient.generate_json(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=sample,
        )

        return result.get("relationships", [])

    except Exception as e:

        print("=" * 60)
        print("RELATIONSHIP EXTRACTION FAILED")
        print(e)
        print("=" * 60)

        return []