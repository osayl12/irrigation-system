import React from "react";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/stats">Statistics</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}