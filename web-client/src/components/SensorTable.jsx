import { useEffect, useState } from "react";
import { api } from "../api/api";
import React from "react";

export default function SensorTable() {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    api.get("/web/sensors")
      .then(res => setSensors(res.data))
      .catch(console.error);
  }, []);

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Value</th>
          <th>Date</th>
          <th>Pot</th>
        </tr>
      </thead>
      <tbody>
        {sensors.map(s => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.SensorName}</td>
            <td>{s.Val_avg}</td>
            <td>{s.date}</td>
            <td>{s.Pot_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
