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
      <h3>Scheduled watering</h3>

      <div className="schedule">
        <div className="field">
          <label htmlFor="sch-start">Start</label>
          <input
            id="sch-start"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="sch-end">End</label>
          <input
            id="sch-end"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="sch-times">Times per day</label>
          <input
            id="sch-times"
            type="number"
            min="1"
            max="6"
            value={times}
            onChange={(e) => setTimes(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor="sch-duration">Duration (min)</label>
          <input
            id="sch-duration"
            type="number"
            min="1"
            max="180"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        <div className="field-actions">
          <button className="btn btn--primary" onClick={saveSettings}>
            Save schedule
          </button>
        </div>
      </div>
    </div>
  );
}
