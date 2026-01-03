import React from "react";
import SensorTable from "../components/SensorTable";
import IrrigationTable from "../components/IrrigationTable";
import ManualControl from "../components/ManualControl";

export default function Dashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h1>🌱 Irrigation System Dashboard</h1>

      <ManualControl />

      <h2>Sensors</h2>
      <SensorTable />

      <h2>Irrigations</h2>
      <IrrigationTable />
    </div>
  );
}
