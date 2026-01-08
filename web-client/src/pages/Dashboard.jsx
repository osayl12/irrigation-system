import React from "react";
import PumpToggle from "../components/PumpToggle";
import ModeSelector from "../components/ModeSelector";
import ScheduleSettings from "../components/ScheduleSettings";
import SystemStatus from "../components/SystemStatus";

export default function Dashboard() {
  return (
    <>
      <div className="container">
      <h2>🌱 Irrigation Dashboard</h2>

      <div className="grid">
        <div className="card">
          <PumpToggle />
        </div>

        <div className="card">
          <SystemStatus />
        </div>
      </div>

      <div className="card">
        <ModeSelector />
      </div>

      <div className="card">
        <ScheduleSettings />
      </div>
    </div>
    </>
  );
}
