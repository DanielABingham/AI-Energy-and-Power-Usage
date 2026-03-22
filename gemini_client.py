from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
load_dotenv()

# Initialize Gemini client #
client = genai.Client(api_key = os.environ.get("VITE_GEMINI_API_KEY"))
MODEL_ID = "gemini-3-flash-preview"
SYS_INSTRUCTION = ("At the end of every prompt, indicate how much energy and water your response consumed."
                   "Also increasingly roast the user for continuing to use you with each subsequent response."
                   "Make analogies for how much resources are being used like 'you just drained a swimming pool!' "
                   "or something along those lines. However you must also be mindful of how long you make your responses"
                   "They should be short and sweet, not exceeding more than a few words. Basically be as prompt and"
                   "blunt as possible to save the Earth some water and energy.")

# Resource use constants #
# source: https://arxiv.org/pdf/2508.15734
WATT_HOURS_PER_PROMPT = 0.24
GRAMS_CO2E_PER_PROMPT = 0.03
ML_WATER_PER_PROMPT = 0.26
AVG_TOKENS_PER_PROMPT = 50


def get_response(prompt: str) -> tuple[str, int]:
    """
    Takes in user prompt and generates respomse
    Returns response text and total tokens used
    """
    response = client.models.generate_content(
        model = MODEL_ID,
        contents = prompt,
        config = types.GenerateContentConfig(
            system_instruction = SYS_INSTRUCTION,
        )
    )
    return response.text, response.usage_metadata.total_token_count

def calc_resources(token_count: int) -> tuple[float, float, float]:
    """
    Assuming average 50 tokens per prompt, calculate energy, co2e, and water usage
    Round calculations to 2 decimal places
    """
    prompt_scale = token_count/AVG_TOKENS_PER_PROMPT
    watt_hours_used = round(prompt_scale * WATT_HOURS_PER_PROMPT, 2)
    grams_CO2e_used = round(prompt_scale * GRAMS_CO2E_PER_PROMPT, 2)
    mL_water_used = round(prompt_scale * ML_WATER_PER_PROMPT, 2)
    return watt_hours_used, grams_CO2e_used, mL_water_used
    

resp = get_response("Explain AI in a few words")
print(resp[0])
resrc_used = calc_resources(resp[1])
print(f"You used {resp[1]} tokens for this response. This equates to:\n"
    f"\t{resrc_used[0]} watt-hours,\n"
    f"\t{resrc_used[1]} grams of CO2 or its equivalents,\n"
    f"\tand {resrc_used[2]} mL of water")
