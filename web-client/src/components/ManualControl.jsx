import { useState } from "react";
import { api } from "../api/api";
import React from "react";

export default function ManualControl() {
  const [potId, setPotId] = useState(1);
  const [duration, setDuration] = useState(5);

  const irrigate = () => {
    api.post("/esp/irrigations", {
      pot_id: potId,
      duration: duration
    })
    .then(() => alert("Irrigation sent"))
    .catch(() => alert("Error"));
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>Manual Irrigation</h2>

      <label>
        Pot ID:
        <input
          type="number"
          value={potId}
          onChange={e => setPotId(e.target.value)}
        />
      </label>

      <label style={{ marginLeft: 10 }}>
        Duration:
        <input
          type="number"
          value={duration}
          onChange={e => setDuration(e.target.value)}
        />
      </label>

      <button onClick={irrigate} style={{ marginLeft: 10 }}>
        Start
      </button>
    </div>
  );
}
