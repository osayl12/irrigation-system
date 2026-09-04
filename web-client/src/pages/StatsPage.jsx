import React from "react";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import WeeklyChart from "../components/WeeklyChart";

const METRICS = [
  { key: "water", label: "Water" },
  { key: "temp", label: "Temperature" },
  { key: "soil", label: "Soil moisture" },
];

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

  const activeMetric = METRICS.find((m) => m.key === metric);

  return (
    <div className="container">
      <div className="page-header">
        <h2>Statistics</h2>
        <p>Last 7 days</p>
      </div>

      <section className="panel">
        <div className="segmented segmented--metric" role="tablist" aria-label="Metric">
          {METRICS.map((m) => (
            <button
              key={m.key}
              role="tab"
              aria-selected={metric === m.key}
              className={`segmented__item ${metric === m.key ? "is-active" : ""}`}
              onClick={() => setMetric(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>{activeMetric.label}{metric === "water" ? " usage" : ""}</h3>
        <WeeklyChart metric={metric} labels={labels} values={values} />
      </section>
    </div>
  );
}
