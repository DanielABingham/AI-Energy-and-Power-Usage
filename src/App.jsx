import { useState, useRef, useEffect } from "react";
import {
  getWaterComparison,
  getElectricityComparison,
  getCarbonComparison,
} from "./utils/comparisons";

import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const energyData = {
    water: { used: 2.0, unit: "mL" },
    electricity: { used: 3.0, unit: "kWh" },
    carbon: { used: 2.0, unit: "gCO2e" },
  };

  const waterNote = getWaterComparison(energyData.water.used);
  const electricNote = getElectricityComparison(energyData.electricity.used);
  const carbonNote = getCarbonComparison(energyData.carbon.used);

  // Auto-scroll to bottom whenever messages or typing state changes
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

  const handleSubmit = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    // 1. Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // 2. Show typing indicator
    setIsTyping(true);

    // 3. TODO: replace this with your real API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "This is where your AI response will appear.",
        },
      ]);
      setIsTyping(false);
    }, 100);
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
        {/* Scrollable messages */}
        <div className="messages-area">
          {messages.length === 0 && !isTyping && (
            <div className="empty-state">
              <h1 className="greeting">Ask anything. See the cost.</h1>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`msg-row ${msg.role}`}>
              <div className="avatar">{msg.role === "user" ? "Y" : "✦"}</div>
              <div className="bubble">{msg.content}</div>
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
              {energyData.water.used.toFixed(2)}
              <span className="stat-unit"> {energyData.water.unit}</span>
            </span>
            {waterNote && <p className="comparison-note">{waterNote}</p>}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-label">Electricity Used</span>
            <span className="stat-value">
              {energyData.electricity.used.toFixed(4)}
              <span className="stat-unit"> {energyData.electricity.unit}</span>
            </span>
            {electricNote && <p className="comparison-note">{electricNote}</p>}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">♻️</div>
          <div className="stat-info">
            <span className="stat-label">Carbon Impact</span>
            <span className="stat-value">
              {energyData.electricity.used.toFixed(2)}
              <span className="stat-unit"> {energyData.carbon.unit}</span>
            </span>
            {carbonNote && <p className="comparison-note">{carbonNote}</p>}
          </div>
        </div>

        <p className="sidebar-note">Updates with each prompt</p>
      </aside>
    </div>
  );
}

export default App;
