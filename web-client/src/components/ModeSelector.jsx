import React, { useState, useEffect } from "react";
import { api } from "../api/api";

/*
  מצבי עבודה לפי דרישות המרצה:
  MANUAL  – שליטה ידנית (MQTT)
  TEMP    – לפי טמפרטורה
  SOIL    – לפי לחות אדמה
  SHABBAT – השקיה מתוזמנת בלבד (ללא חיישנים)
*/
const MODES = [
  { key: "MANUAL", glyph: "🖐", label: "Manual" },
  { key: "TEMP", glyph: "🌡", label: "Temperature" },
  { key: "SOIL", glyph: "🌱", label: "Soil moisture" },
  { key: "SHABBAT", glyph: "🕯", label: "Shabbat" },
];

export default function ModeSelector() {
  const [active, setActive] = useState("MANUAL");
  const [loading, setLoading] = useState(false);

  // סנכרון מצב אמיתי מהשרת

  useEffect(() => {
    api.get("/web/status").then((res) => {
      if (res.data.mode) setActive(res.data.mode);
    });
  }, []);

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
      <h3>Mode</h3>

      <div className="segmented" role="tablist" aria-label="Irrigation mode">
        {MODES.map((m) => (
          <button
            key={m.key}
            role="tab"
            aria-selected={active === m.key}
            onClick={() => selectMode(m.key)}
            disabled={loading}
            className={`segmented__item ${active === m.key ? "is-active" : ""}`}
          >
            <span aria-hidden="true">{m.glyph}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
