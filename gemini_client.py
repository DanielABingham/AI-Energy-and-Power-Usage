from google import genai
from google.genai import types
import os

# Initialize Gemini client #
client = genai.Client(api_key = os.environ.get("GEMINI_API"))
MODEL_ID = "gemini-3-flash-preview"
SYS_INSTRUCTION = ("At the end of every prompt, indicate how must energy and water your response consumed."
                   "Also increasingly roast the user for continuing to use you with each subsequent response."
                   "Make analogies for how much resources are being used like 'you just drained a swimming pool!' "
                   "or something along those lines. However you must also be mindful of how long you make your responses"
                   "They should be short and sweet, not exceeding more than a few words. Basically be as prompt and"
                   "blunt as possible to save the Earth some water and energy.")


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
    #print(response.usage_metadata.total_token_count)

    #response.count_tokens()
    return response.text, response.usage_metadata.total_token_count

resp = get_response("Explain AI in a few words")
print(resp[0], "\nYou used", resp[1], "tokens to generate this response")