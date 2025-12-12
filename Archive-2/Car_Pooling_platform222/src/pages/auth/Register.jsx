// src/pages/auth/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Register({ setUser }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", password: "", role: "USER", gender: "Male"
    });
    const [loading, setLoading] = useState(false);

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const text = await res.text();
            if (!res.ok) throw new Error(text);

            if (res.status === 202 || formData.role === "ADMIN") {
                alert("Registration successful! Waiting for Manager approval.");
                navigate("/login");
            } else {
                const data = JSON.parse(text);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                setUser(data);
                navigate("/");
            }
        } catch (err) { alert(err.message || "Registration failed"); }
        finally { setLoading(false); }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{textAlign:'center', marginBottom:24}}>
                    <UserPlus size={40} className="text-blue-500 mx-auto mb-2" color="#3b82f6" />
                    <h2 className="text-2xl font-bold" style={{margin:0}}>Create Account</h2>
                    <p style={{color:'#94a3b8', marginTop:5}}>Join VeloCity today</p>
                </div>

                <form onSubmit={handleRegister}>
                    <label>Name</label>
                    <input value={formData.fullname} onChange={e => setFormData({...formData, fullname: e.target.value})} required placeholder="John Doe" />
                    
                    <label>Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="name@example.com" />
                    
                    <label>Phone</label>
                    <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 890" />
                    
                    <label>Gender</label>
                    <div style={{display:'flex', gap:20, marginBottom:16}}>
                        <label style={{display:'flex', alignItems:'center', cursor:'pointer', color:'white'}}>
                            <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={e => setFormData({...formData, gender: e.target.value})} style={{width:'auto', marginRight:8}}/> Male
                        </label>
                        <label style={{display:'flex', alignItems:'center', cursor:'pointer', color:'white'}}>
                            <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={e => setFormData({...formData, gender: e.target.value})} style={{width:'auto', marginRight:8}}/> Female
                        </label>
                        <label style={{display:'flex', alignItems:'center', cursor:'pointer', color:'white'}}>
                            <input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={e => setFormData({...formData, gender: e.target.value})} style={{width:'auto', marginRight:8}}/> Other
                        </label>
                    </div>

                    <label>Password</label>
                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required placeholder="••••••••" />
                    
                    <label>Role</label>
                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="USER">Traveller / Driver</option>
                        <option value="ADMIN">Administrator (Requires Approval)</option>
                    </select>

                    <button className="btn btn-primary" style={{marginTop:20}} disabled={loading}>
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>
                <div style={{marginTop:24, textAlign:'center', fontSize:14, color:'#94a3b8'}}>
                    Already have an account? <Link to="/login" style={{color:'#3b82f6', fontWeight:'bold', textDecoration:'none'}}>Log In</Link>
                </div>
            </div>
        </div>
    );
}