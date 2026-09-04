import React from "react";
import PumpToggle from "../components/PumpToggle";
import ModeSelector from "../components/ModeSelector";
import ScheduleSettings from "../components/ScheduleSettings";
import SystemStatus from "../components/SystemStatus";

export default function Dashboard() {
  return (
    <div className="container">
      <section className="panel panel--telemetry">
        <SystemStatus />
      </section>

      <div className="row">
        <section className="panel panel--pump">
          <PumpToggle />
        </section>

        <section className="panel panel--mode">
          <ModeSelector />
        </section>
      </div>

      <section className="panel panel--schedule">
        <ScheduleSettings />
      </section>
    </div>
  );
}
