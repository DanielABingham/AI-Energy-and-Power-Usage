import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");

  const energyData = {
    water: { used: 0.0, unit: "liters" },
    electricity: { used: 0.0, unit: "kWh" },
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    console.log("Submitted:", input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="app">
      <main className="main">
        <div className="center">
          <h1 className="greeting">What can I help with?</h1>
          <div className="input-box">
            <input
              type="text"
              className="chat-input"
              placeholder="Message AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="submit-btn" onClick={handleSubmit}>
              ↑
            </button>
          </div>
        </div>
      </main>

      <aside className="sidebar">
        <h2 className="sidebar-title">Resource Usage</h2>

        <div className="stat-card">
          <div className="stat-icon">💧</div>
          <div className="stat-info">
            <span className="stat-label">Water Used</span>
            <span className="stat-value">
              {energyData.water.used.toFixed(2)}
              <span className="stat-unit"> {energyData.water.unit}</span>
            </span>
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
          </div>
        </div>

        <p className="sidebar-note">Updates with each prompt</p>
      </aside>
    </div>
  );
}

export default App;
