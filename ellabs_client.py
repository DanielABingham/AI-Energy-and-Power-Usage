from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os
load_dotenv()

elevenlabs = ElevenLabs(
  api_key = os.environ.get("ELEVENLABS_API"),
)
VOICE_ID = "dgkKQcJqyy5AP0dqleUU"
VOICE_MODEL = "eleven_v3"

audio = elevenlabs.text_to_speech.convert(
    text = "Warning! You've exceeded 1 gallon of water. KILL YOURSELF!",
    voice_id = VOICE_ID,
    model_id = VOICE_MODEL,
    output_format = "mp3_44100_128",
)

play(audio)

def play_audio()
