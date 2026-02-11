import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import LightWarningPopup from "./LightWarningPopup";

export default function PumpToggle() {
  const [pumpOn, setPumpOn] = useState(false);
  const [warning, setWarning] = useState(null);

  /* ===== קבלת סטטוס מערכת (כולל משאבה) ===== */
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/web/status");
        if (res.data.pump !== undefined) {
          setPumpOn(res.data.pump);
        }
      } catch {}
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ===== בדיקת אזהרות ===== */
  useEffect(() => {
    const fetchWarning = async () => {
      try {
        const statusRes = await api.get("/web/status");
        const mode = statusRes.data?.mode;

        // רק במצב MANUAL מציגים Popup
        if (mode !== "MANUAL") {
          setWarning(null);
          return;
        }

        const warnRes = await api.get("/web/warnings");
        setWarning(warnRes.data);
      } catch {}
    };

    fetchWarning();
    const interval = setInterval(fetchWarning, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ===== שליטה ===== */
  const turnOn = () => {
    api.post("/web/pump", { state: true });
    setPumpOn(true);
  };

  const forceTurnOn = () => {
    api.post("/web/pump", { state: true, force: true }).then(() => {
      setPumpOn(true);
      setWarning(null);
    });
  };

  const turnOff = () => {
    api.post("/web/pump", { state: false });
    setWarning(null);
    setPumpOn(false);
  };

  return (
    <div>
      <h3>Pump Control</h3>

      <button onClick={turnOn} disabled={pumpOn}>
        ON
      </button>

      <button onClick={turnOff}>OFF</button>

      <p>
        Status:
        <span style={{ color: pumpOn ? "green" : "red" }}>
          {pumpOn ? " ON" : " OFF"}
        </span>
      </p>

      <LightWarningPopup
        warning={warning}
        onConfirm={forceTurnOn}
        onCancel={() => {
          api.post("/web/pump", { state: false });
          setWarning(null);
        }}
      />
    </div>
  );
}
