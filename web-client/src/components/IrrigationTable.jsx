import { useEffect, useState } from "react";
import { api } from "../api/api";
import React from "react";

export default function IrrigationTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/web/irrigations")
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Time</th>
          <th>Duration</th>
          <th>Pot</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
