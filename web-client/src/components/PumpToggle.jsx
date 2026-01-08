import React from "react";
import PumpToggle from "../components/PumpToggle";
import ModeSelector from "../components/ModeSelector";
import ScheduleSettings from "../components/ScheduleSettings";
import SystemStatus from "../components/SystemStatus";

export default function Dashboard() {
  return (
    <>
      <h2>Dashboard</h2>

      <PumpToggle />
      <ModeSelector />
      <ScheduleSettings />
      <SystemStatus />
    </>
  );
}
