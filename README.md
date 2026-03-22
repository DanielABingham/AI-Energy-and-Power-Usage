## Inspiration
We are getting tired of every piece of software seemingly having some sort of AI integrated so we wanted to show the **REAL** resource impact of **YOUR** prompts and actions. Gemini's responses are also factored in our calculations so you feel bad which is further accented by a Samuel L. Jackson voice who criticizes you for using AI unnecessarily.
## What it does
Our AI chatbot answers your questions in as **FEW** words as possible with a dashboard to the right showing your **TOTAL** resource (water, energy, carbon) usage. Gemini also shows a per prompt resource usage. Also, an ElevenLabs Samuel L. Jackson like voice criticizes you in a disappointed voice for your resource usage.
## How we built it
We used **Vite** for a quick set up and **React** (Javascript XML), **CSS**, **Python**, and a little bit of **HTML** to create the web app. We use the Gemini API to get responses to the user's prompts and ElevenLabs API to "*scream*" a line at the you the user, criticizing you for your environmental impact. We referenced this technical report from Google for our resource calculations: [Measuring the environmental impact of delivering AI at Google Scale](https://arxiv.org/abs/2508.15734).
## Challenges we ran into
We had some trouble connecting the Gemini API to our React logic and we similarly had some trouble connecting the ElevenLabs API to our React logic. Fixing our web app's formatting also took some effort.
## Accomplishments that we're proud of
We are proud of being able to use both the Gemini API and ElevenLabs API in one project to create a fun web app that also informs users about their AI usage impact!
## What we learned
We learned how to use the Gemini API and how to use the ElevenLabs API to create a web app that opens the eyes of AI users. We also learned how to create a good-looking web app using React, CSS, Python and debug problems we faced along the way.
## What's next for Sustainable AI Chatbot
We want to try to get the latency for the ElevenLabs API call down as it takes 10-20 seconds before the voice starts speaking.
## How to run
First you must clone the repo (enter your SSH passcode)
```
git clone https://github.com/DanielABingham/I-Think-Therefore-I-Burn.git
```
Next, you will want to open the project in a code editor or IDE
Install any dependencies using:
```
npm install
```
Then, you will want to open the terminal and run the web app using:
```
npm run dev
```
You will want to create a .env file and enter your Gemini and ElevenLabs API keys
```
VITE_GEMINI_API_KEY= // enter you API key here
VITE_ELEVENLABS_API_KEY= // enter your API key here
```
Now everything should work! Enjoy!
