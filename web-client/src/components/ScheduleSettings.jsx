import React, { useState } from "react";
import { api } from "../api/api";

export default function ScheduleSettings() {
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const [times, setTimes] = useState(2);
  const [duration, setDuration] = useState(1);

  const saveSettings = async () => {
    await api.post("/web/schedule", { start, end, times, duration });
    alert("Schedule saved");
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

      <label>
        Duration per irrigation (minutes):
        <input
          type="number"
          min="1"
          max="180"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </label>

      <br />
      <br />
      <button onClick={saveSettings}>💾 Save</button>
    </div>
  );
}
