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
  const [active, setActive] = useState("MANUAL");

  const selectMode = async mode => {
    setActive(mode);
    try {
      await api.post("/web/mode", { mode });
    } catch {
      alert("Failed to change mode");
    }
  };

  return (
    <>
      <h3>Mode Selection</h3>
      {MODES.map(m => (
        <button
          key={m.key}
          className={`primary ${active === m.key ? "active" : ""}`}
          onClick={() => selectMode(m.key)}
        >
          {m.label}
        </button>
      ))}
    </>
  );
}
