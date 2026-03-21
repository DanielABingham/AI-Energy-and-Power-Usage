from google import genai

# pip install -q -U google-genai
client = genai.Client()
#genai.configure(api_key)

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Explain how AI works in a few words",
)

print(response.text)