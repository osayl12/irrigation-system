import { useEffect, useState } from "react";
import { api } from "../api/api";
import React from "react";

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/web/status");
        setStatus(res.data);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <p> Server not responding</p>;
  }

  if (!status) {
    return <p>⏳ Waiting for system status...</p>;
  }

  return (
    <div>
      <h3>System Status</h3>
     <p>
        MQTT:{" "}
        <b style={{ color: status.mqttConnected ? "green" : "red" }}>
          {status.mqttConnected ? "CONNECTED" : "DISCONNECTED"}
        </b>
      </p>

      <p>
        Pump:{" "}
        <b style={{ color: status.pump ? "green" : "red" }}>
          {status.pump ? "ON" : "OFF"}
        </b>
      </p>

      <p>
        Mode: <b>{status.mode}</b>
      </p>

      <p>
        Temperature:{" "}
        <b>
          {status.temp !== null ? `${status.temp} °C` : "N/A"}
        </b>
      </p>

      <p>
        Soil Moisture:{" "}
        <b>
          {status.soil !== null ? status.soil : "N/A"}
        </b>
      </p>

      <p>
        Light Level:{" "}
        <b>
          {status.light !== null ? status.light : "N/A"}
        </b>
      </p>
    </div>
  );
}
