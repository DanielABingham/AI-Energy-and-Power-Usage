from google import genai
from google.genai import types

# Initialize Gemini client #
client = genai.Client(api_key = "")
MODEL_ID = "gemini-3-flash-preview"
SYS_INSTRUCTION = "At the end of every prompt, indicate how must energy and water your response consumed."

response = client.models.generate_content(
    model = MODEL_ID,
    contents = "Explain how AI works in a few words",
    config = types.GenerateContentConfig(
        system_instruction = SYS_INSTRUCTION,
    )
)



print(response.text)