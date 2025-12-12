import AdminLayout from "./AdminLayout";
import React, { useEffect, useState, useMemo } from "react";
import { apiGet } from "../../api/api";
import "./AdminDashboard.css";
import ToggleSwitch from "../../components/ToggleSwitch";

export default function AdminDashboard({ darkMode, setDarkMode }) {

  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const u = await apiGet("/api/admin/users");
    const r = await apiGet("/api/admin/rides");
    setUsers(u || []);
    setRides(r || []);
  }

  // Toggle Handler
  const handleToggle = (newState) => {
    setDarkMode(newState);
  };

  // Toggle Component for header
  const ToggleComponent = useMemo(() => (
    <ToggleSwitch
      label={darkMode ? "Dark" : "Light"}
      initialState={darkMode}
      onToggle={handleToggle}
    />
  ), [darkMode]);


  return (
    <AdminLayout headerControls={ToggleComponent} darkMode={darkMode}>

      <h2 className="page-title">Admin Dashboard</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{users.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Total Drivers</div>
          <div className="stat-value">
            {users.filter(u => u.role === "DRIVER").length}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Total Passengers</div>
          <div className="stat-value">
            {users.filter(u => u.role === "USER").length}
          </div>
        </div>

      </div>

    </AdminLayout>
  );
}
