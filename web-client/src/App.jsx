/*
פרויקט : Smart Irrigation System

שם מלא: דינה נאש
ת.ז: 311487185

שם מלא : אוסיל חאמד
ת.ז: 208913798

*/

import React from "react";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-inner">
          <span className="logo">🌱 Irrigation System</span>
          <div className="nav-links">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/stats">Statistics</NavLink>
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
