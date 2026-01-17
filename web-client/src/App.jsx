import React from "react";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
<nav className="navbar">
  <div className="nav-inner">
    <span className="logo">🌱 Irrigation System</span>
    <div className="nav-links">
      <Link to="/">Dashboard</Link>
      <Link to="/stats">Statistics</Link>
    </div>
  </div>
</nav>


      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}