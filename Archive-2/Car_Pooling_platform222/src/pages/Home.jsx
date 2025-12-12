// src/pages/Home.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Search, ShieldCheck } from "lucide-react";
import ToggleSwitch from "../components/ToggleSwitch"; // ⭐ ADD THIS

export default function Home({ user }) {
    const navigate = useNavigate();

    // ⭐ DARK MODE STATE
    const [darkMode, setDarkMode] = useState(false);

    return (
        // ⭐ APPLY THEME CLASS WITHOUT BREAKING ANY EXISTING CODE
        <div className={darkMode ? "theme-dark" : "theme-light"}>

            {/* ⭐ Add Toggle in top-right corner */}
            <div style={{
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 20
            }}>
                <ToggleSwitch
                    label="Dark"
                    initialState={darkMode}
                    onToggle={setDarkMode}
                />
            </div>

            {/* -------------------- EXISTING CODE BELOW (UNTOUCHED) -------------------- */}

            {/* 1. Not Logged In - Landing View */}
            {!user && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '85vh', textAlign: 'center' }}>
                    <div className="animate-pop">
                        <h1 style={{ fontSize: '5rem', fontWeight: 800, margin: 0, lineHeight: 1, letterSpacing: '-2px' }}>
                            Ride the <span style={{ color: 'var(--primary)', textShadow: '0 0 30px rgba(0, 229, 255, 0.5)' }}>Future</span>
                        </h1>
                        <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', maxWidth: 600, margin: '20px auto 40px' }}>
                            The most advanced peer-to-peer carpooling network. Connect, share, and travel in style.
                        </p>

                        {/* Updated Button Layout */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                            <Link
                                to="/register"
                                className="btn btn-primary"
                                style={{
                                    padding: '18px 64px',
                                    fontSize: 18,
                                    borderRadius: '50px',
                                    boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.4)'
                                }}
                            >
                                Get Started
                            </Link>

                            {/* Login */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>Already have an account?</span>
                                <Link
                                    to="/login"
                                    className="btn"
                                    style={{
                                        padding: '10px 32px',
                                        fontSize: 15,
                                        fontWeight: '600',
                                        borderRadius: '50px',
                                        background: 'linear-gradient(135deg, #5cb6f6ff 0%, #46caefff 100%)',
                                        color: 'white',
                                        border: 'none',
                                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                    }}
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Admin / Manager / Assistant */}
            {user && (user.role.includes("Admin") || user.role === "MANAGER" || user.role.includes("Assistant")) && (
                <div className="container animate-fade" style={{ textAlign: 'center', marginTop: 120 }}>
                    <div style={{ background: 'rgba(217, 70, 239, 0.1)', width: 100, height: 100, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                        <ShieldCheck size={50} color="var(--secondary)" />
                    </div>
                    <h1 style={{ marginBottom: 10 }}>Admin Control Center</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>Manage users, requests, and platform data.</p>
                    <button onClick={() => navigate('/admin')} className="btn btn-primary" style={{ padding: '16px 32px' }}>
                        Enter Dashboard
                    </button>
                </div>
            )}

            {/* 3. Logged-in User */}
            {user && !(user.role.includes("Admin") || user.role === "MANAGER" || user.role.includes("Assistant")) && (
                <div className="container animate-fade" style={{ paddingTop: 60 }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: 10, fontWeight: 800 }}>
                            Your Journey <span className="text-blue-500">Starts Here</span>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Where would you like to go today?</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 40 }}>

                        {/* Book Card */}
                        <div className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: 50 }} onClick={() => navigate('/book')}>
                            <div style={{ background: 'rgba(0, 229, 255, 0.1)', width: 90, height: 90, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <Search size={36} color="var(--primary)" />
                            </div>
                            <h3>Find a Ride</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>Search available rides and book instantly.</p>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Book Now</button>
                        </div>

                        {/* Host Card */}
                        <div className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: 50 }} onClick={() => navigate('/host')}>
                            <div style={{ background: 'rgba(70, 152, 239, 0.1)', width: 90, height: 90, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <Car size={36} color="#4695efff" />
                            </div>
                            <h3>Host a Ride</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>Share your seats and reduce travel costs.</p>

                            <button className="btn btn-primary" style={{ width: '100%' }}>
                                Host Now
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
