import React from "react";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import WeeklyChart from "../components/WeeklyChart";

export default function StatsPage() {
  const [metric, setMetric] = useState("water");
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    api
      .get(`/web/stats/weekly?type=${metric}`)
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
  }, [metric]);

  return (
    <div className="container">
      <h2>📊 Statistics (last 7 days)</h2>

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
          title={metric.toUpperCase()}
          labels={labels}
          values={values}
        />
      </div>
    </div>
  );
}
