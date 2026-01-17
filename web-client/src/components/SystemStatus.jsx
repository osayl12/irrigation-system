import React, { useEffect, useState } from "react";
import { api } from "../api/api";

export default function SystemStatus() {
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
        setStatus(res.data);
      } catch (err) {
        console.error("Failed to fetch status");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
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

      <p>Mode: <strong>{status.mode}</strong></p>

      <p>
        Temperature:{" "}
        {status.temp !== undefined && status.temp !== null
          ? `${status.temp} °C`
          : "N/A"}
      </p>

      <p>
        Soil Moisture:{" "}
        {status.soil !== undefined && status.soil !== null
          ? status.soil
          : "N/A"}
      </p>

      <p>
        Light Level:{" "}
        {status.light !== undefined && status.light !== null
          ? status.light
          : "N/A"}
      </p>
    </div>
  );
}
