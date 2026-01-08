import React from "react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import WeeklyChart from "../components/WeeklyChart";

export default function StatsPage() {
  const [type, setType] = useState("temp");
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    api.get(`/web/stats/weekly?type=${type}`)
      .then(res => {
        setLabels(res.data.map(r => r.date));
        setValues(res.data.map(r => r.avg_value));
      })
      .catch(console.error);
  }, [type]);

  return (
    <>
      <h2>Weekly Statistics</h2>

      <div>
        <button onClick={() => setType("water")}>💧 Water</button>
        <button onClick={() => setType("temp")}>🌡 Temperature</button>
        <button onClick={() => setType("soil")}>🌱 Soil</button>
      </div>

      <WeeklyChart
        title={`Weekly ${type}`}
        labels={labels}
        values={values}
      />
    </>
  );
}
