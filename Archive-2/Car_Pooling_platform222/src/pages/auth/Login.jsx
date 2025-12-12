// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../../api/api";
import { Car, X } from "lucide-react";

export default function Login({ setUser }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotStatus, setForgotStatus] = useState(null); // 'success' or error message

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await apiPost("/api/auth/login", { email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            navigate(data.role === "MANAGER" || (data.role && data.role.toUpperCase().includes("ADMIN")) ? "/admin" : "/rides/hosted");
        } catch (err) {
            alert(err.message);
        } finally { setLoading(false); }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        setForgotStatus("sending");
        try {
            await apiPost("/api/auth/forgot-password", { email: forgotEmail });
            setForgotStatus("success");
        } catch (err) {
            setForgotStatus(err.message || "Failed to send email");
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{textAlign:'center', marginBottom:24}}>
                    <Car size={40} className="text-blue-500 mx-auto mb-2"/>
                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                    <p className="text-gray-400">Login to continue</p>
                </div>

                <form onSubmit={handleLogin}>
                    <label>Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" />
                    
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                    
                    <div style={{textAlign:'right', marginTop:-10, marginBottom:30}}>
                        <button type="button" onClick={() => {setShowForgot(true); setForgotStatus(null);}} className="text-sm text-blue-400 hover:text-blue-300 bg-transparent border-none cursor-pointer underline">
                            Forgot Password?
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button 
                            className="btn font-bold text-white shadow-xl transition-all hover:scale-[1.05]"
                            style={{
                                background: 'linear-gradient(135deg, #2563eb 0%, #3a88edff 100%)',
                                border: 'none',
                                padding: '14px 60px',
                                fontSize: '16px',
                                color: 'white',
                                borderRadius: '50px',
                                minWidth: '180px'

                            }}
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account? <Link to="/register" className="text-blue-400 font-bold no-underline ml-1">Sign Up</Link>
                </div>
            </div>

            {showForgot && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Reset Password</h3>
                            <button onClick={() => setShowForgot(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><X/></button>
                        </div>
                        
                        {forgotStatus !== 'success' ? (
                            <form onSubmit={handleForgotPassword}>
                                <p style={{color:'var(--text-muted)', marginBottom:15}}>Enter your email address and we'll send you a link to reset your password.</p>
                                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="Enter your email" required />
                                
                                {forgotStatus && forgotStatus !== 'sending' && (
                                    <div className="text-red-400 text-sm mb-3 text-center">{forgotStatus}</div>
                                )}

                                <div style={{display:'flex', justifyContent:'center', marginTop:10}}>
                                    <button className="btn btn-primary" style={{borderRadius:'50px', padding:'10px 30px'}} disabled={forgotStatus === 'sending'}>
                                        {forgotStatus === 'sending' ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div style={{textAlign:'center'}}>
                                <div style={{background:'rgba(16, 185, 129, 0.2)', color:'#34d399', padding:15, borderRadius:10, marginBottom:15}}>
                                    ✓ Reset link sent!
                                </div>
                                <p style={{fontSize:13, color:'var(--text-muted)'}}>Check your inbox. The link is valid for 20 minutes.</p>
                                <button onClick={() => setShowForgot(false)} className="btn btn-secondary" style={{marginTop:15, borderRadius:'50px', padding:'8px 24px'}}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}