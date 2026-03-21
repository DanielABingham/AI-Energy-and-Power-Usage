from google import genai
from google.genai import types
import os

# Initialize Gemini client #
client = genai.Client(api_key = os.environ.get("GEMINI_API"))
MODEL_ID = "gemini-3-flash-preview"
SYS_INSTRUCTION = ("At the end of every prompt, indicate how must energy and water your response consumed."
                   "Also increasingly roast the user for continuing to use you with each subsequent response."
                   "Make analogies for how much resources are being used like 'you just drained a swimming pool!' "
                   "or something along those lines.")
