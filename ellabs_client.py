from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os
load_dotenv()

import gemini_client

elevenlabs = ElevenLabs(
    api_key = os.environ.get("ELEVENLABS_API"),
)
VOICE_ID = "Pc6mkcSQXB2l3WmfeKVS"
VOICE_MODEL = "eleven_v3"

WATT_HOURS_THRESHOLD = 10
GRAMS_CO2E_THRESHOLD = 10
ML_WATER_THRESHOLD = 10


def scream(prompt):
    audio = elevenlabs.text_to_speech.convert(
        voice_id = VOICE_ID,
        model_id = VOICE_MODEL,
        text = prompt,
        output_format = "mp3_44100_128",
    )
    play(audio)

def check_currant_use(curr_wh, curr_co2, curr_water):
    if curr_wh > WATT_HOURS_THRESHOLD or curr_co2 > GRAMS_CO2E_THRESHOLD or curr_water > ML_WATER_THRESHOLD:
        roast = gemini_client.get_response(f"Roast me for using AI carelressly. Make analogies to shame the user."
                                           f"YELL ANGIRLY for your entire response. Pretend you are Samuel L Jackson. Use rated R insults but with PG-13 language."
                                           f"In total, I've used {curr_wh} watt-hours of energy, generated {curr_co2} grams of CO2 or equivalent, and wasted {curr_water} milliliters of water.")
        scream(roast[0])

check_currant_use(500, 500, 500)