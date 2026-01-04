import { useEffect, useState } from "react";
import { api } from "../api/api";
import React from "react";
export default function SensorTable() {
  const [sensors, setSensors] = useState([]);

useEffect(() => {
    const fetchSensors = () => {
      api.get("/web/sensors")
        .then(res => setSensors(res.data))
        .catch(console.error);
    };

    fetchSensors(); // טעינה ראשונית

    const interval = setInterval(fetchSensors, 5000); // כל 5 שניות

    return () => clearInterval(interval); // ניקוי
  }, []);

  const deleteSensor = (id) => {
    if (!window.confirm("Are you sure you want to delete this sensor record?")) {
      return;
    }

    api.delete(`/web/sensors/${id}`)
      .then(() => {
        // עדכון ה־UI בלי רענון
        setSensors(prev => prev.filter(s => s.id !== id));
      })
      .catch(() => alert("Failed to delete sensor"));
  };

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Value</th>
          <th>Date</th>
          <th>Pot</th>
          <th>Action</th>
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
            <td>
              <button onClick={() => deleteSensor(s.id)}>
                Delete Sensor
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
