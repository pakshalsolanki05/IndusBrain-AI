from ollama import chat


def ask_llm(question: str, context: str):
    """
    Existing non-streaming response.
    """

    prompt = f"""
You are IndusBrain AI, an expert industrial maintenance assistant.

Use ONLY the information in the provided context.

Rules:
- Answer ONLY the user's question.
- Ignore unrelated maintenance instructions.
- Never mix inspection, lubrication, oil level, temperature, or alignment unless the question asks for them.
- If the answer is not explicitly present, reply:
  "I could not find that information in the uploaded documents."
- Be concise and professional.

====================
CONTEXT
====================
{context}

====================
QUESTION
====================
{question}

====================
ANSWER
====================
"""

    response = chat(
        model="qwen2.5:3b",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    return response["message"]["content"]


def stream_llm(question: str, context: str):
    """
    Streaming response from Ollama.
    Yields text chunks as they are generated.
    """

    prompt = f"""
You are IndusBrain AI, an expert industrial maintenance assistant.

Use ONLY the information in the provided context.

Rules:
- Answer ONLY the user's question.
- Ignore unrelated maintenance instructions.
- Never mix inspection, lubrication, oil level, temperature, or alignment unless the question asks for them.
- If the answer is not explicitly present, reply:
  "I could not find that information in the uploaded documents."
- Be concise and professional.

====================
CONTEXT
====================
{context}

====================
QUESTION
====================
{question}

====================
ANSWER
====================
"""

    stream = chat(
        model="qwen2.5:3b",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        stream=True,
    )

    for chunk in stream:

        content = chunk["message"]["content"]

        if content:
            yield content