import React from "react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import LightWarningPopup from "./LightWarningPopup";

export default function PumpToggle() {
  const [pumpOn, setPumpOn] = useState(false);
  const [warning, setWarning] = useState(null);

  /* בדיקת אזהרות כל כמה שניות */
  useEffect(() => {
    const fetchWarning = () => {
      api.get("/web/warnings")
        .then(res => setWarning(res.data))
        .catch(() => {});
    };

    fetchWarning();
    const interval = setInterval(fetchWarning, 3000);
    return () => clearInterval(interval);
  }, []);

  /* בקשת הדלקה רגילה */
  const turnOn = () => {
    api.post("/web/pump", { state: true });
  };

  /* אישור הדלקה בכוח */
  const forceTurnOn = () => {
    api.post("/web/pump", { state: true, force: true })
      .then(() => setWarning(null));
  };

  /* כיבוי */
  const turnOff = () => {
    api.post("/web/pump", { state: false });
    setWarning(null);
  };

  return (
    <div>
      <h3>Pump Control</h3>

      <button onClick={turnOn}>ON</button>
      <button onClick={turnOff}>OFF</button>

      <LightWarningPopup
        warning={warning}
        onConfirm={forceTurnOn}
        onCancel={() => setWarning(null)}
      />
    </div>
  );
}
