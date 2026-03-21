from google import genai

# pip install -q -U google-genai
client = genai.Client(api_key = "AIzaSyAt9nqLIm5IH25Af47gxZCmlbV3SSLKFKM")


response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Explain how AI works in a few words",
)

print(response.text)