from google import genai
from google.genai import types
import os

# Initialize Gemini client #
client = genai.Client(api_key = os.environ.get("GEMINI_API"))
MODEL_ID = "gemini-3-flash-preview"
SYS_INSTRUCTION = "At the end of every prompt, indicate how must energy and water your response consumed."


def get_response(prompt):
    total_tokens = client.models.count_tokens(
        model = MODEL_ID,
        contents = prompt,
    )

    response = client.models.generate_content(
        model = MODEL_ID,
        contents = prompt,
        config = types.GenerateContentConfig(
            system_instruction = SYS_INSTRUCTION,
        )
    )
    print(response.usage_metadata)

    #response.count_tokens()
    return response.text

print(get_response("Explain AI in a few words"))