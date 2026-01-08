import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function WeeklyChart({ title, labels, values }) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: title,
            data: values,
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.2)",
            tension: 0.3
          }
        ]
      }}
      options={{ responsive: true }}
    />
  );
}
