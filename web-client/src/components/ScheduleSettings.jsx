import React from "react";
import { useState } from "react";
import { api } from "../api/api";

export default function ScheduleSettings() {
  const [start, setStart] = useState("06:00");
  const [end, setEnd] = useState("18:00");
  const [times, setTimes] = useState(2);

  const saveSettings = async () => {
    try {
      await api.post("/web/schedule", {
        start_time: start,
        end_time: end,
        times_per_day: times
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
        <input type="time" value={start} onChange={e => setStart(e.target.value)} />
      </label>

      <br />

      <label>
        End:
        <input type="time" value={end} onChange={e => setEnd(e.target.value)} />
      </label>

      <br />

      <label>
        Times per day:
        <input
          type="number"
          min="1"
          max="6"
          value={times}
          onChange={e => setTimes(e.target.value)}
        />
      </label>

      <br /><br />

      <button onClick={saveSettings}>💾 Save</button>
    </div>
  );
}
