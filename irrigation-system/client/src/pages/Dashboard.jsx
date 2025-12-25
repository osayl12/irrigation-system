import { useEffect, useState } from "react";
import { getSensorsByPot } from "../api/espApi";

const Dashboard = () => {
  const [sensors, setSensors] = useState([]);
  const potId = 1; // כרגע סטטי

  useEffect(() => {
    getSensorsByPot(potId)
      .then((res) => setSensors(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌱 Irrigation Dashboard</h1>

      {sensors.length === 0 && <p>No data yet</p>}

      {sensors.map((s, i) => (
        <div key={i} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p><b>Sensor:</b> {s.SensorName}</p>
          <p><b>AVG:</b> {s.Val_avg}</p>
          <p><b>Date:</b> {s.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
