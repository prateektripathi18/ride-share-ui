// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import Rides from "./pages/Rides.jsx";
import HostRide from "./pages/HostRide.jsx";
import BookRide from "./pages/BookRide.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import AdminProfile from "./pages/admin/AdminProfile";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // THEME: darkMode state stored in localStorage
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Load current user from localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      try { setCurrentUser(JSON.parse(u)); }
      catch (err) { localStorage.removeItem("user"); }
    }
  }, []);

  // Apply or remove .dark on <html> when darkMode changes
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const PrivateRoute = ({ element }) =>
    currentUser ? element : <Navigate to="/login" replace />;

  const AdminRoute = ({ element }) =>
    currentUser && (currentUser.role.includes("ADMIN") || currentUser.role === "MANAGER")
      ? element
      : <Navigate to="/" replace />;

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {/* pass down theme state and setter */}
        <Navbar
          user={currentUser}
          setUser={setCurrentUser}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home user={currentUser} />} />
            <Route path="/rides/hosted" element={<Rides user={currentUser} type="hosted" />} />
            <Route path="/rides/travelled" element={<Rides user={currentUser} type="travelled" />} />
            <Route path="/rides/requested" element={<Rides user={currentUser} type="requested" />} />
            <Route path="/host" element={<PrivateRoute element={<HostRide user={currentUser} />} />} />
            <Route path="/book" element={<PrivateRoute element={<BookRide user={currentUser} />} />} />
            <Route path="/admin" element={<AdminRoute element={<AdminDashboard user={currentUser} darkMode={darkMode} setDarkMode={setDarkMode} />} />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/login" element={<Login setUser={setCurrentUser} />} />
            <Route path="/register" element={<Register setUser={setCurrentUser} />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
