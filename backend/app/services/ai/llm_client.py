import json
import ollama

MODEL = "qwen2.5:3b"


class LLMClient:
    """
    Central AI client powered by Ollama.
    """

    @staticmethod
    def generate(
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ) -> str:

        response = ollama.chat(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            options={
                "temperature": temperature,
            },
        )

        return response["message"]["content"]

    @staticmethod
    def generate_json(
        system_prompt: str,
        user_prompt: str,
    ):

        response = ollama.chat(
            model=MODEL,
            format="json",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            options={
                "temperature": 0,
            },
        )

        return json.loads(
            response["message"]["content"]
        )