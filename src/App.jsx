import { useState, useRef, useEffect } from "react";
import "./App.css";

// ── Gemini config ──────────────────────────────────────────────────────────
const VITE_GEMINI_API_KEY = import.meta.env.GEMINI_API;
const MODEL = "gemini-2.0-flash";

const SYS_INSTRUCTION = `At the end of every prompt, indicate how much energy and water your response consumed.
Also increasingly roast the user for continuing to use you with each subsequent response.
Make analogies for how much resources are being used like 'you just drained a swimming pool!'
or something along those lines. However you must also be mindful of how long you make your responses.
They should be short and sweet, not exceeding more than a few words. Basically be as prompt and
blunt as possible to save the Earth some water and energy.`;

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

  // Accumulated sidebar totals
  const [totals, setTotals] = useState({
    mLWater: 0,
    wattHours: 0,
    gramsCO2: 0,
  });

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const energyData = {
    water: { used: 0.0, unit: "mL" },
    electricity: { used: 0.0, unit: "kWh" },
    carbon: { used: 0.0, unit: "gCO2e" },
  };

  // Assuming a 500 mL water bottle
  const waterBottles = energyData.water.used / 500;

  // Assuming a 1000 watt microwave
  const microwaveRunTime = energyData.electricity.used;

  // Based on 8,887 grams of CO2/gallon of gasoline = 8.887 × 10-3 metric tons CO2/gallon of gasoline
  const gasEmissionComparison = (energyData.carbon.used / 8887).toFixed(6);

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
      {/* ── Main chat area ── */}
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
            <span className="stat-value">
              {totals.mLWater.toFixed(2)}
              <span className="stat-unit"> mL</span>
            </span>
          </div>
        </div>
        <div className="hide">
          You used the equivalent of <strong>{waterBottles}</strong> water
          bottles!
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-label">Electricity Used</span>
            <span className="stat-value">
              {totals.wattHours.toFixed(2)}
              <span className="stat-unit"> Wh</span>
            </span>
          </div>
        </div>
        <div className="hide">
          You used enough electricity to power a 1000 watt microwave for{" "}
          <strong>{microwaveRunTime}</strong> minutes!
        </div>

        <div className="stat-card">
          <div className="stat-icon">♻️</div>
          <div className="stat-info">
            <span className="stat-label">Carbon Impact</span>
            <span className="stat-value">
              {energyData.carbon.used.toFixed(2)}
              <span className="stat-unit"> {energyData.carbon.unit}</span>
            </span>
          </div>
        </div>
        <div className="hide">
          You emitted as much carbon dioxide prompting Gemini as burning{" "}
          <strong>{gasEmissionComparison}</strong> gallons of gas!
        </div>

        <p className="sidebar-note">Updates with each prompt</p>
      </aside>
    </div>
  );
}

export default App;
