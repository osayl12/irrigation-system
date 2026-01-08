import React from "react";
import { useState } from "react";
import { api } from "../api/api";

export default function PumpToggle() {
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const togglePump = async () => {
    setLoading(true);
    setError(false);

    try {
      await api.post("/web/pump", { state: !isOn });
      setIsOn(prev => !prev);
    } catch (err) {
      console.error("PumpToggle error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Pump Control</h3>

      <button
        onClick={togglePump}
        disabled={loading}
        style={{
          backgroundColor: isOn ? "#c62828" : "#2e7d32",
          color: "white",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading
          ? "Processing..."
          : isOn
          ? "Turn OFF Pump"
          : "Turn ON Pump"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "8px" }}>
          Server not responding
        </p>
      )}
    </div>
  );
}
