import React from "react";
import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function SystemStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = () => {
      api.get("/web/status")
        .then(res => setStatus(res.data))
        .catch(console.error);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <p>Loading system status...</p>;

  return (
    <div>
      <h3>System Status</h3>

      <p>Mode: <b>{status.mode}</b></p>
      <p>Pump: <b>{status.pump ? "ON" : "OFF"}</b></p>
      <p>Light: <b>{status.light_ok ? "OK" : "NOT RECOMMENDED"}</b></p>
    </div>
  );
}
