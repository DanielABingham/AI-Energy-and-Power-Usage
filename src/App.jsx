import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");

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
    </div>
  );
}

export default App;
