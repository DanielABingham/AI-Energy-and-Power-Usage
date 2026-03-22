from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os
load_dotenv()

import gemini_client

elevenlabs = ElevenLabs(
    api_key = os.environ.get("ELEVENLABS_API"),
)
VOICE_ID = "dgkKQcJqyy5AP0dqleUU"
VOICE_MODEL = "eleven_v3"


def scream(prompt):
    audio = elevenlabs.text_to_speech.convert(
        voice_id = VOICE_ID,
        model_id = VOICE_MODEL,
        text = prompt, #"Warning! You've exceeded 1 gallon of water. KILL YOURSELF!"
        output_format = "mp3_44100_128",
    )
    play(audio)

def check_currant_use(curr_wh, curr_co2, curr_water):
    if curr_wh > 5 or curr_co2 > 5 or curr_water > 5:
        roast = gemini_client.get_response(f"Roast me for using {curr_wh} watt-hours, generating {curr_co2} grams of CO2 or equivalent, and using {curr_water} milliliter of water for AI use."
                                           f"Make analogies with the information to shame the user into better habits")
        scream(roast[0])


check_currant_use(100, 100, 100)

'''
"At the end of every prompt, indicate how much energy and water your response consumed."
                   "Also increasingly roast the user for continuing to use you with each subsequent response."
                   "Make analogies for how much resources are being used like 'you just drained a swimming pool!' "
                   "or something along those lines. However you must also be mindful of how long you make your responses"
                   "They should be short and sweet, not exceeding more than a few words. Basically be as prompt and"
                   "blunt as possible to save the Earth some water and energy."

'''