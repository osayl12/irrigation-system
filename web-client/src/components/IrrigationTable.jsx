import { useEffect, useState } from "react";
import { api } from "../api/api";
import React from "react";
export default function IrrigationTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchIrrigations = () => {
      api.get("/web/irrigations")
        .then(res => setData(res.data))
        .catch(console.error);
    };

    fetchIrrigations();

    const interval = setInterval(fetchIrrigations, 5000);

    return () => clearInterval(interval);
  }, []);

  const deleteIrrigation = (id) => {
    if (!window.confirm("Are you sure you want to delete this irrigation record?")) {
      return;
    }

    api.delete(`/web/irrigations/${id}`)
      .then(() => {
        // עדכון ה־UI בלי רענון
        setData(prev => prev.filter(item => item.id !== id));
      })
      .catch(() => alert("Failed to delete record"));
  };

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Time</th>
          <th>Duration</th>
          <th>Pot</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map(i => (
          <tr key={i.id}>
            <td>{i.id}</td>
            <td>{i.date}</td>
            <td>{i.time}</td>
            <td>{i.count}</td>
            <td>{i.pot_id}</td>
            <td>
              <button onClick={() => deleteIrrigation(i.id)}>
                Delete Irrigation
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
