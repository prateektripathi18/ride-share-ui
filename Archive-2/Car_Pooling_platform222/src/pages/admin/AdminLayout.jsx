import React from "react";
import "./AdminLayout.css";
import { Link } from "react-router-dom";

export default function AdminLayout({ children, headerControls, darkMode }) {
  return (
    <div className={`admin-container ${darkMode ? "theme-dark" : "theme-light"}`}>
      
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">🚗 VeloCity</h2>

        <nav className="menu">
          <Link to="/admin" className="menu-item">Overview</Link>
          <Link to="/admin/drivers" className="menu-item">Drivers</Link>
          <Link to="/admin/passengers" className="menu-item">Passengers</Link>
          <Link to="/admin/pending" className="menu-item">Pending</Link>
          <Link to="/admin/settings" className="menu-item">Settings</Link>
          <Link to="/logout" className="menu-item logout">Logout</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Top Navbar */}
        <header className="topbar">
          <h3 className="admin-title">Admin</h3>
          <div className="topbar-actions">
            {headerControls}
            <button className="btn-profile">Profile</button>
            <button className="btn-logout">Logout</button>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>

      </main>

    </div>
  );
}
