/*
פרויקט : Irrigation System

שם מלא: דינה נאש
ת.ז: 311487185

שם מלא : אוסיל חאמד
ת.ז: 208913798

*/

import React from "react";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#6cbf5c" />
      <path d="M16 6s7 8 7 12.6A7 7 0 0 1 9 18.6C9 14 16 6 16 6z" fill="#1b170f" />
    </svg>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-inner">
          <span className="brand">
            <BrandMark />
            Irrigation System
          </span>
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
