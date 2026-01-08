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

  const selectMode = mode => {
    setActive(mode);
    api.post("/web/mode", { mode });
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
