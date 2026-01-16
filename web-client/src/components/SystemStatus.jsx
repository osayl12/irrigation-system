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
        MQTT: <b>{status.mqttConnected ? "CONNECTED" : "DISCONNECTED"}</b>
      </p>
    </div>
  );
}
