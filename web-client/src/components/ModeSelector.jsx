import React, { useState } from "react";
import { api } from "../api/api";

/*
  מצבי עבודה לפי דרישות המרצה:
  MANUAL  – שליטה ידנית (MQTT)
  TEMP    – לפי טמפרטורה
  SOIL    – לפי לחות אדמה
  SHABBAT – השקיה מתוזמנת בלבד (ללא חיישנים)
*/
const MODES = [
  { key: "MANUAL", label: "🖐 Manual" },
  { key: "TEMP", label: "🌡 Temperature" },
  { key: "SOIL", label: "🌱 Soil Moisture" },
  { key: "SHABBAT", label: "🕯 Shabbat" },
];

export default function ModeSelector() {
  const [active, setActive] = useState("MANUAL");
  const [loading, setLoading] = useState(false);

  const selectMode = async (mode) => {
    if (loading) return;

    // UI משתנה מיד (Optimistic UI)
    setActive(mode);
    setLoading(true);

    try {
      await api.post("/web/mode", { mode });
    } catch (err) {
      alert("Failed to change mode");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Mode Selection</h3>

      {MODES.map((m) => (
        <button
          key={m.key}
          onClick={() => selectMode(m.key)}
          disabled={loading}
          style={{
            marginRight: "8px",
            backgroundColor: active === m.key ? "#4caf50" : "#eee",
            color: active === m.key ? "white" : "black",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
