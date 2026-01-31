import React, { useEffect, useState } from "react";
import { api } from "../api/api";

export default function SystemStatus() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({
    mqttConnected: false,
    pump: false,
    mode: "UNKNOWN",
    temp: null,
    soil: null,
    light: null,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/web/status");
        setStatus((prev) => ({ ...prev, ...res.data }));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch status");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>System Status</h3>

      <p>
        MQTT:{" "}
        <strong style={{ color: status.mqttConnected ? "green" : "red" }}>
          {status.mqttConnected ? "CONNECTED" : "DISCONNECTED"}
        </strong>
      </p>

      <p>
        Pump:{" "}
        <strong style={{ color: status.pump ? "green" : "red" }}>
          {status.pump ? "ON" : "OFF"}
        </strong>
      </p>

      <p>
        Mode: <strong>{status.mode}</strong>
      </p>

      <p>
        Temperature:{" "}
        {loading ? "Updating..." : status.temp !== null ? `${status.temp} °C` : "N/A"}
      </p>

      <p>Soil Moisture: {loading ? "Updating..." : status.soil ?? "N/A"}</p>

      <p>Light Level: {loading ? "Updating..." : status.light ?? "N/A"}</p>
    </div>
  );
}
