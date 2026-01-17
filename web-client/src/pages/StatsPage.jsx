import React from "react";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import WeeklyChart from "../components/WeeklyChart";

export default function StatsPage() {
  const [mode, setMode] = useState("MANUAL");
  const [metric, setMetric] = useState("water");
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    api
      .get(`/web/stats/weekly?mode=${mode}&type=${metric}`)
      .then((res) => {
        setLabels(
          res.data.map((r) => new Date(r.date).toLocaleDateString("he-IL")),
        );
        setValues(res.data.map((r) => Number(r.avg_value)));
      })
      .catch(() => {
        setLabels([]);
        setValues([]);
      });
  }, [mode, metric]);

  return (
    <div className="container">
      <h2>📊 Statistics</h2>

      <div className="card">
        <h3>Mode</h3>
        {["MANUAL", "TEMP", "SOIL", "SHABBAT"].map((m) => (
          <button
            key={m}
            className={mode === m ? "primary active" : "secondary"}
            onClick={() => setMode(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="card">
        <h3>Data Type</h3>
        {["water", "temp", "soil"].map((t) => (
          <button
            key={t}
            className={metric === t ? "success active" : "secondary"}
            onClick={() => setMetric(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card">
        <WeeklyChart
          title={`${metric.toUpperCase()} – ${mode}`}
          labels={labels}
          values={values}
        />
      </div>
    </div>
  );
}
