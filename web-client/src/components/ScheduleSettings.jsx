import React, { useState } from "react";
import { api } from "../api/api";

export default function ScheduleSettings() {
  const [start, setStart] = useState("06:00");
  const [end, setEnd] = useState("18:00");
  const [times, setTimes] = useState(2);

  const saveSettings = async () => {
    if (start >= end) {
      alert("End time must be after start time");
      return;
    }

    if (!Number.isInteger(times) || times < 1 || times > 6) {
      alert("Times per day must be between 1 and 6");
      return;
    }

    try {
      await api.post("/web/schedule", {
        start,
        end,
        times,
      });
      alert("Schedule saved");
    } catch {
      alert("Failed to save schedule");
    }
  };

  return (
    <div>
      <h3>Irrigation Schedule</h3>

      <label>
        Start:
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </label>

      <br />

      <label>
        End:
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </label>

      <br />

      <label>
        Times per day:
        <input
          type="number"
          min="1"
          max="6"
          value={times}
          onChange={(e) => setTimes(Number(e.target.value))}
        />
      </label>

      <br />
      <br />

      <button onClick={saveSettings}>💾 Save</button>
    </div>
  );
}
