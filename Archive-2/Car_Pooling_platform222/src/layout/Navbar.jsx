import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Home, List, MapPin, Calendar, Shield } from "lucide-react";

export default function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    function handleLogoutConfirm() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setShowLogoutConfirm(false);
        navigate("/");
    }

    const isActive = (path) => location.pathname === path ? "text-blue-500" : "text-gray-400 hover:text-white";
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="logo">
                        <img 
                            src="/logo.png" 
                            alt="VeloCity Logo" 
                            style={{ height: '45px', width: 'auto', objectFit: 'contain' }} 
                            onError={(e) => {e.target.style.display='none'}} 
                        />
                        <span className="font-bold text-3xl tracking-tight ml-3">
                            Velo<span className="text-blue-500">City</span>
                        </span>
                    </Link>

                    <div className="nav-links">
                        {user ? (
                            <>
                                {user.role === 'USER' && (
                                    <>
                                        <Link to="/" className={`nav-item ${isActive('/')}`}><Home size={18}/> Home</Link>
                                        <Link to="/rides/hosted" className={`nav-item ${isActive('/rides/hosted')}`}><List size={18}/> Hosted</Link>
                                        <Link to="/rides/travelled" className={`nav-item ${isActive('/rides/travelled')}`}><MapPin size={18}/> Travelled</Link>
                                        <Link to="/rides/requested" className={`nav-item ${isActive('/rides/requested')}`}><Calendar size={18}/> Requested</Link>
                                    </>
                                )}

                                {(user.role === 'MANAGER' || (user.role && user.role.toUpperCase().includes('ADMIN'))) && (
                                    <Link to="/admin" className="nav-item text-purple-400 font-bold"><Shield size={18}/> Admin Portal</Link>
                                )}

                                <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-1.5 rounded-full border border-gray-700 ml-4">
                                    <div className="flex flex-col text-right leading-none">
                                        <span className="text-sm font-bold text-white">{user.fullname}</span>
                                        <span className="text-[10px] text-blue-400 uppercase tracking-wider">{user.role}</span>
                                    </div>
                                    <button onClick={() => setShowLogoutConfirm(true)} className="text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                                        <LogOut size={18}/>
                                    </button>
                                </div>
                            </>
                        ) : (
                            !isAuthPage && (
                                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                                    <Link to="/login" className="btn btn-primary" style={{ borderRadius: '50px', padding: '10px 32px' }}>Login</Link>
                                    <Link to="/register" className="btn" style={{ borderRadius: '50px', padding: '10px 32px', background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', color: 'white', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)' }}>Sign Up</Link>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{maxWidth: '350px', textAlign: 'center'}}>
                        <h3 className="text-xl font-bold mb-2">Logout</h3>
                        <p className="text-gray-400 mb-6">Do you really want to logout?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowLogoutConfirm(false)} className="btn btn-secondary flex-1">Cancel</button>
                            <button onClick={handleLogoutConfirm} className="btn btn-danger flex-1">Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}