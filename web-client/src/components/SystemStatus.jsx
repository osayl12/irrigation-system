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
    stale: false,
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

  const linkStale = status.mqttConnected && status.stale;
  const linkOk = status.mqttConnected && !status.stale;

  return (
    <div className="telemetry">
      <div className="telemetry__header">
        <span
          className={`led ${linkOk ? "led--on" : "led--off"} ${linkStale ? "led--stale" : ""}`}
        />
        <span className="telemetry__link">
          {!status.mqttConnected ? "Link lost" : linkStale ? "Link stale" : "Link established"}
        </span>
        <span className="telemetry__mode">{status.mode}</span>
      </div>

      <div className="readouts">
        <div className="readout">
          <span className="readout__value">
            {loading || status.temp === null ? "--" : status.temp}
            <small>°C</small>
          </span>
          <span className="readout__label">Temp</span>
        </div>

        <div className="readout readout--water">
          <span className="readout__value">
            {loading || status.soil === null ? "--" : status.soil}
          </span>
          <span className="readout__label">Soil</span>
        </div>

        <div className="readout readout--sun">
          <span className="readout__value">
            {loading || status.light === null ? "--" : status.light}
          </span>
          <span className="readout__label">Light</span>
        </div>
      </div>
    </div>
  );
}
