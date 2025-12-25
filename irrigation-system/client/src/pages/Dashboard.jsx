import React, { useEffect, useState } from "react";
import { getSensorsByPot } from "../api/espApi";


const Dashboard = () => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      getSensorsByPot(1)
        .then((res) => setSensors(res.data))
        .catch(console.error);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🌱 Irrigation Dashboard</h1>

      {sensors.map((s, i) => (
        <div key={i}>
          {s.sensorname}: {s.val_avg}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
