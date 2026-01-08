import React from "react";
import { useState } from "react";
import { api } from "../api/api";

const MODES = [
  { key: "MANUAL", label: "🖐 Manual" },
  { key: "TEMP", label: "🌡 Temperature" },
  { key: "SOIL", label: "🌱 Soil Moisture" },
  { key: "SHABBAT", label: "🕯 Shabbat" }
];

export default function ModeSelector() {
  const [activeMode, setActiveMode] = useState(null);

  const setMode = async (mode) => {
    try {
      await api.post("/web/mode", { mode });
      setActiveMode(mode);
    } catch {
      alert("Failed to change mode");
    }
  };

  return (
    <div>
      <h3>Operation Mode</h3>

      {MODES.map(m => (
        <button
          key={m.key}
          onClick={() => setMode(m.key)}
          style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: activeMode === m.key ? "#1976d2" : "#ccc",
            color: "white"
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
