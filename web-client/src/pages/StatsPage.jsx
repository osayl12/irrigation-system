import React from "react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import WeeklyChart from "../components/WeeklyChart";

const MODES = [
  { key: "MANUAL", label: "🖐 Manual" },
  { key: "TEMP", label: "🌡 Temperature" },
  { key: "SOIL", label: "🌱 Soil Moisture" },
  { key: "SHABBAT", label: "🕯 Shabbat" }
];

const METRICS = [
  { key: "water", label: "💧 Water" },
  { key: "temp", label: "🌡 Temperature" },
  { key: "soil", label: "🌱 Soil Moisture" }
];

export default function StatsPage() {
  const [mode, setMode] = useState("MANUAL");
  const [metric, setMetric] = useState("water");
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);

    api
      .get(`/web/stats/weekly?mode=${mode}&type=${metric}`)
      .then(res => {
        setLabels(res.data.map(r =>     new Date(r.date).toLocaleDateString("he-IL")));
        setValues(res.data.map(r => Number(r.avg_value)));
      })
      .catch(() => setError(true));
  }, [mode, metric]);

  return (
    <div>
      <h2>Statistics</h2>

      {/* בחירת מצב */}
      <h4>Mode</h4>
      {MODES.map(m => (
        <button
          key={m.key}
          onClick={() => setMode(m.key)}
          style={{
            margin: "5px",
            backgroundColor: mode === m.key ? "#1976d2" : "#ccc",
            color: "white"
          }}
        >
          {m.label}
        </button>
      ))}

      {/* בחירת נתון */}
      <h4 style={{ marginTop: "20px" }}>Data Type</h4>
      {METRICS.map(m => (
        <button
          key={m.key}
          onClick={() => setMetric(m.key)}
          style={{
            margin: "5px",
            backgroundColor: metric === m.key ? "#2e7d32" : "#ccc",
            color: "white"
          }}
        >
          {m.label}
        </button>
      ))}

      {error && (
        <p style={{ color: "red" }}>Failed to load statistics</p>
      )}

      <WeeklyChart
        title={`Weekly ${metric} (${mode})`}
        labels={labels}
        values={values}
      />
    </div>
  );
}
