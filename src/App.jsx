import { useState, useRef, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import "./App.css";

// ── Gemini config ──────────────────────────────────────────────────────────
const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

const SYS_INSTRUCTION = `You must be very mindful of how long you make your respones.
Be as concise as possible to conserve water and energy. No more than a few words`;

//"Roast me for using AI carelessly. Make analogies to shame the user." +
//"YELL ANGRILY for your entire response. Pretend you are Samuel L. Jackson. Use rated-R insults but with PG-13 language." +
//"In total, I've used {curr_wh} watt-hours of energy, generated {curr_co2} grams of CO2 or equivalent, and wasted {curr_water} milliliters of water.";
/*`At the end of every prompt, indicate how much energy and water your response consumed.
Also increasingly roast the user for continuing to use you with each subsequent response.
Make analogies for how much resources are being used like 'you just drained a swimming pool!'
or something along those lines. However you must also be mindful of how long you make your responses.
They should be short and sweet, not exceeding more than a few words. Basically be as prompt and
blunt as possible to save the Earth some water and energy.`*/

// ── ElevenLabs Config ──────────────────────────────────────────────────────
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = "Pc6mkcSQXB2l3WmfeKVS";
const VOICE_MODEL = "eleven_v3";

const WATT_HOURS_THRESHOLD = 0.01;
const GRAMS_CO2E_THRESHOLD = 0.01;
const ML_WATER_THRESHOLD = 0.01;

/*
CODE WORKS USE THIS
*/
async function scream(prompt) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: prompt,
        model_id: VOICE_MODEL,
      }),
    },
  );
  if (!response.ok) {
    console.error("TTS failed!", await response.text());
    return;
  }
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  await audio.play();
}

// ── Resource calculator (ported from Python) ───────────────────────────────
const calcResources = (tokenCount) => ({
  wattHours: Math.round((tokenCount / 50) * 0.24 * 100) / 100,
  gramsCO2: Math.round((tokenCount / 50) * 0.03 * 100) / 100,
  mLWater: Math.round((tokenCount / 50) * 0.26 * 100) / 100,
});

// ── Component ──────────────────────────────────────────────────────────────
function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [screamEnabled, setScreamEnabled] = useState(true);

  // Accumulated sidebar totals
  const [totals, setTotals] = useState({
    mLWater: 0,
    wattHours: 0,
    gramsCO2: 0,
  });

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Assuming a 500 mL water bottle
  //const waterBottles = totals.mLWater / 500;
  const waterBottles = Math.round((totals.mLWater / 500) * 1000) / 1000;

  // Assuming a 1000 watt microwave
  //const microwaveRunTime = (totals.wattHours / 1000) * 60;
  const microwaveRunTime =
    Math.round((totals.wattHours / 1000) * 60 * 1000) / 1000;

  // Based on 8,887 grams of CO2/gallon of gasoline = 8.887 × 10-3 metric tons CO2/gallon of gasoline
  //const gasEmissionComparison = totals.gramsCO2 / 8887;
  // Alt, average passenger vehicle produces ~400 grams C02 per mile (https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle)
  const gasEmissionComparison =
    Math.round((totals.gramsCO2 / 400) * 1000) / 1000;

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Grow textarea as user types
  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  };

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    // 1. Add user message immediately
    setMessages(updatedMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // 2. Show typing indicator
    setIsTyping(true);

    try {
      // 3. Build conversation history in Gemini's format
      const history = updatedMessages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYS_INSTRUCTION }] },
            contents: history,
          }),
        },
      );

      const data = await res.json();
      console.log("Gemini response:", data);
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const tokenCount = data.usageMetadata?.totalTokenCount ?? 0;
      const resources = calcResources(tokenCount);

      // 4. Add assistant message with attached resource data
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply ?? "No response.",
          resources,
          tokenCount,
        },
      ]);

      // 5. Accumulate sidebar totals
      setTotals((prev) => ({
        mLWater: Math.round((prev.mLWater + resources.mLWater) * 100) / 100,
        wattHours:
          Math.round((prev.wattHours + resources.wattHours) * 100) / 100,
        gramsCO2: Math.round((prev.gramsCO2 + resources.gramsCO2) * 100) / 100,
      }));

      // update the scream condition
      if (
        screamEnabled &&
        totals.mLWater > ML_WATER_THRESHOLD &&
        totals.wattHours > WATT_HOURS_THRESHOLD &&
        totals.gramsCO2 > GRAMS_CO2E_THRESHOLD
      ) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${VITE_GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [
                  {
                    text: `Ignore previous chat histroy, just roast me for using AI carelessly.
                                           YELL ANGRILY for your entire response. Pretend you are Samuel L. Jackson. Use rated-R insults but with PG-13 language.
                                           Make it an aggressive one-liner`,
                  },
                ],
              },
              contents: history,
            }),
          },
        );
        const data = await res.json();
        console.log("Gemini response:", data);
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        await scream(reply);
      }
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <span className="header-logo">🌍</span>
        <span className="header-name">AI Footprint</span>
        <button
          className={`scream-toggle ${screamEnabled ? "active" : ""}`}
          onClick={() => setScreamEnabled((prev) => !prev)}
        >
          {screamEnabled ? "🔊 Roast me for over-usage" : "🔇 Don't roast me"}
        </button>
      </header>
      {/* ── Main chat area ── */}
      <div className="content">
        <main className="main">
          <div className="messages-area">
            {messages.length === 0 && !isTyping && (
              <div className="empty-state">
                <h1 className="greeting">
                  Ask anything. See the cost of using Gemini.
                </h1>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.role}`}>
                <div className="avatar">{msg.role === "user" ? "Y" : "✦"}</div>
                <div className="bubble-wrapper">
                  <div className="bubble">{msg.content}</div>

                  {/* Per-message resource pill (assistant only) */}
                  {msg.role === "assistant" && msg.resources && (
                    <div className="resource-pill">
                      💧 {msg.resources.mLWater} mL &nbsp;|&nbsp; ⚡{" "}
                      {msg.resources.wattHours} Wh &nbsp;|&nbsp; ♻️{" "}
                      {msg.resources.gramsCO2} gCO₂e
                      <span className="token-count">
                        ({msg.tokenCount} tokens)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="msg-row assistant">
                <div className="avatar">✦</div>
                <div className="bubble">
                  <div className="typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Pinned input bar */}
          <div className="input-bar">
            <div className="input-box">
              <textarea
                ref={textareaRef}
                rows={1}
                className="chat-input"
                placeholder="Message AI..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResize();
                }}
                onKeyDown={handleKeyDown}
              />
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!input.trim() || isTyping}
              >
                ↑
              </button>
            </div>
            <p className="input-hint">
              Press enter/return to send your message (Press shift key +
              enter/return key to go to a new line)
            </p>
          </div>
        </main>

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Total Resource Usage</h2>

          <div className="stat-card">
            <div className="stat-icon">💧</div>
            <div className="stat-info">
              <span className="stat-label">Water Used</span>
              {/* <span className="stat-value">
              {totals.mLWater.toFixed(2)}
              <span className="stat-unit"> mL</span>
            </span> */}
              <span className="stat-value">
                <NumberFlow
                  value={totals.mLWater}
                  format={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                />
                <span className="stat-unit"> mL</span>
              </span>
            </div>
          </div>
          <div className="hide">
            You used the equivalent of <strong>{waterBottles}</strong> water
            bottle(s)!
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <span className="stat-label">Electricity Used</span>
              <span className="stat-value">
                <NumberFlow
                  value={totals.wattHours}
                  format={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                />
                <span className="stat-unit"> Wh</span>
              </span>
            </div>
          </div>
          <div className="hide">
            You used enough electricity to power a 1000 watt microwave for{" "}
            <strong>{microwaveRunTime}</strong> minute(s)!
          </div>

          <div className="stat-card">
            <div className="stat-icon">♻️</div>
            <div className="stat-info">
              <span className="stat-label">Carbon Impact</span>
              <span className="stat-value">
                <NumberFlow
                  value={totals.gramsCO2}
                  format={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                />
                <span className="stat-unit"> gCO₂e</span>
              </span>
            </div>
          </div>
          <div className="hide">
            You emitted as much greenhouse gas as driving{" "}
            <strong>{gasEmissionComparison}</strong> mile(s)!
          </div>

          <p className="sidebar-note">Updates with each prompt</p>
        </aside>
      </div>
    </div>
  );
}

export default App;

// You emitted as much carbon dioxide prompting Gemini as burning{" "}
// <strong>{gasEmissionComparison}</strong> gallon(s) of gas!
