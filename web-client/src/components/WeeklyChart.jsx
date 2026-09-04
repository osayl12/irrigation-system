import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const THEME = {
  water: { line: "#5cb7df", fill: "rgba(92, 183, 223, 0.16)" },
  temp: { line: "#e2a13a", fill: "rgba(226, 161, 58, 0.16)" },
  soil: { line: "#6cbf5c", fill: "rgba(108, 191, 92, 0.16)" },
};

const MONO = "'JetBrains Mono', ui-monospace, monospace";

export default function WeeklyChart({ metric, labels, values }) {
  if (!labels || !values || labels.length === 0) {
    return <p className="empty-state">No data yet for this range.</p>;
  }

  const accent = THEME[metric] || THEME.water;

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: accent.line,
        backgroundColor: accent.fill,
        pointBackgroundColor: accent.line,
        pointRadius: 3,
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#201a12",
        titleFont: { family: MONO },
        bodyFont: { family: MONO },
        borderColor: "#3c331f",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: "#272016" },
        ticks: { color: "#a89c85", font: { family: MONO, size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#272016" },
        ticks: { color: "#a89c85", font: { family: MONO, size: 11 } },
      },
    },
  };

  return (
    <div className="chart-wrap">
      <Line data={data} options={options} />
    </div>
  );
}
