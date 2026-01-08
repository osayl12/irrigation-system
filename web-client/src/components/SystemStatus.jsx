import React from "react";
import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
 const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatus = () => {
      api.get("/web/status")
        .then(res => setStatus(res.data))
        .catch(console.error);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 50000);
    return () => clearInterval(interval);
  }, []);

if (!status) {
  return (
    <div>
      <h3>System Status</h3>
      <p>Waiting for server response...</p>
    </div>
  );
}

  return (
    <div>
      <h3>System Status</h3>

      <p>Mode: <b>{status.mode}</b></p>
      <p>Pump: <b>{status.pump ? "ON" : "OFF"}</b></p>
<p>
  Light:{" "}
  <b>
    {status.light_ok === undefined
      ? "UNKNOWN"
      : status.light_ok
      ? "OK"
      : "NOT RECOMMENDED"}
  </b>
</p>
    </div>
  );
}
