## Inspiration
We are getting tired of every piece of software seemingly having some sort of AI integrated so we wanted to show the **REAL** resource impact of **YOUR** prompts and actions. Gemini's responses are also factored in our calculations so you feel bad which is further accented by a Samuel L. Jackson voice who criticizes you for using AI unnecessarily.
## What it does
This project is an AI chatbot that answers questions in as **few words as possible**. Alongside the chat interface, a dashboard displays your **total** estimated resource usage, including:

- Water
- Energy
- Carbon emissions

In addition, an ElevenLabs Samuel L. Jackson like voice criticizes you in a disappointed voice for your resource usage.


## How we built it
We built the web app using:

- **Vite** for fast project setup and development
- **React** for the frontend
- **CSS** for styling
- **Python** for supporting logic
- A small amount of **HTML**

We use the **Gemini API** to generate chatbot responses and the **ElevenLabs API** to generate voice lines that criticize the user’s resource usage.

For our environmental impact estimates, we referenced Google’s technical report:  
[Measuring the environmental impact of delivering AI at Google Scale](https://arxiv.org/abs/2508.15734)

## Challenges we ran into
We had some trouble connecting the Gemini API to our React logic and we similarly had some trouble connecting the ElevenLabs API to our React logic. Fixing our web app's formatting also took some effort.
## Accomplishments that we're proud of
We are proud of being able to use both the Gemini API and ElevenLabs API in one project to create a fun web app that also informs users about their AI usage impact!
## What we learned
We learned how to use the Gemini API and how to use the ElevenLabs API to create a web app that opens the eyes of AI users. We also learned how to create a good-looking web app using React, CSS, Python and debug problems we faced along the way.
## What's next for Sustainable AI Chatbot
We want to try to get the latency for the ElevenLabs API call down as it takes 10-20 seconds before the voice starts speaking.
## How to run
First you must clone the repo
```
git clone https://github.com/DanielABingham/I-Think-Therefore-I-Burn.git
```

Next, you will want to open the project in a code editor or IDE

Open the terminal and then install any dependencies using:
```
npm install
```
Then, while still in the terminal you will want to run the web app by running this command:
```
npm run dev
```

You will want to create a .env file and enter your Gemini and ElevenLabs API keys in the file:
```
VITE_GEMINI_API_KEY= # enter your Gemini API key here
VITE_ELEVENLABS_API_KEY= # enter your ElevenLabs API key here
```
Now everything should work! Enjoy!
