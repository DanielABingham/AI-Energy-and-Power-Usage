from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
load_dotenv()
# Initialize Gemini client #
client = genai.Client(api_key = os.environ.get("GEMINI_API"))
MODEL_ID = "gemini-3-flash-preview"
SYS_INSTRUCTION = ("At the end of every prompt, indicate how much energy and water your response consumed."
                   "Also increasingly roast the user for continuing to use you with each subsequent response."
                   "Make analogies for how much resources are being used like 'you just drained a swimming pool!' "
                   "or something along those lines. However you must also be mindful of how long you make your responses"
                   "They should be short and sweet, not exceeding more than a few words. Basically be as prompt and"
                   "blunt as possible to save the Earth some water and energy.")

def get_response(prompt):
    response = client.models.generate_content(
        model = MODEL_ID,
        contents = prompt,
        config = types.GenerateContentConfig(
            system_instruction = SYS_INSTRUCTION,
        )
    )
    return response.text, response.usage_metadata.total_token_count

def calc_water_energy(token_count):
    """
    Assume avg 50 tokens
    Energy (Wh/prompt) 0.24
    Emissions (gCO2e/prompt) 0.03
        greenhouse CO2 equivalent / prompt = gCO2e / Wh
    Water (mL/prompt) 0.26
    """
    watt_hours_used = round((token_count/50) * 0.24, 2)
    grams_CO2e_used = round((token_count/50) * 0.03, 2)
    mL_water_used = round((token_count/50) * 0.26, 2)
    return watt_hours_used, grams_CO2e_used, mL_water_used
    

resp = get_response("Explain AI in a few words")
print(resp[0])
resrc_used = calc_water_energy(resp[1])
print(f"You used {resp[1]} tokens for this response. This equates to:\n"
    f"\t{resrc_used[0]} watt-hours,\n"
    f"\t{resrc_used[1]} grams of CO2 or its equivalents,\n"
    f"\tand {resrc_used[2]} mL of water")
