// src/pages/HostRide.jsx
import React, { useState, useEffect, useRef } from "react";
import { apiPost, apiGet } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, CheckCircle, Upload, Wind, Music, Radio } from "lucide-react";

export default function HostRide({ user }) {
    const navigate = useNavigate();
    const dateRef = useRef(null);
    const timeRef = useRef(null);

    const [myCars, setMyCars] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState("");

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    // Form keeps existing fields for UI, but we'll map to backend fields when submitting
    const [form, setForm] = useState({
        driverName: user ? user.fullname : "",
        driverPhotoUrl: "",
        fromLocation: "",
        toLocation: "",
        seatsAvailable: 1,   // UI field -> will map to totalSeats
        price: 0,
        description: "",
        features: { ac: true, music: false, radio: false }
    });

    const [pickupPoints, setPickupPoints] = useState([""]);
    const [dropoffPoints, setDropoffPoints] = useState([""]);

    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [showAddCar, setShowAddCar] = useState(false);

    const [newCar, setNewCar] = useState({ name: "", number: "", imageUrl: "" });
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (user?.email) fetchCars();
    }, [user]);

    async function fetchCars() {
        if (!user?.email) return;
        try {
            // Use user.email (backend uses email as user id)
            const cars = await apiGet(`/api/users/${encodeURIComponent(user.email)}/cars`);
            setMyCars(cars || []);
        } catch (err) {
            console.error("Error loading cars:", err);
        }
    }

    const handleImageUpload = (e, setter) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result);
        reader.readAsDataURL(file);
    };

    async function handleAddCar(e) {
        e.preventDefault();
        if (!user?.email) {
            alert("Login required to add car");
            return;
        }
        try {
            const savedCar = await apiPost(`/api/users/${encodeURIComponent(user.email)}/cars`, newCar);
            setMyCars(prev => [...prev, savedCar]);
            setSelectedCarId(savedCar.id);
            setShowAddCar(false);
            setNewCar({ name: "", number: "", imageUrl: "" });
        } catch (err) {
            console.error("Add car failed:", err);
            alert("Failed to add car");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!user?.email) {
            alert("Please log in to host a ride.");
            return;
        }

        if (!selectedCarId) {
            alert("Please select or add a car.");
            return;
        }

        // Validate date & time
        const selectedDateTime = new Date(`${date}T${time}`);
        if (isNaN(selectedDateTime)) {
            alert("Please select valid date and time.");
            return;
        }
        if (selectedDateTime < new Date()) {
            alert("Please choose a future date/time.");
            return;
        }

        setLoading(true);

        try {
            // Map frontend fields to backend RideRequest DTO fields
            const payload = {
                hostEmail: user.email,                                // backend expects hostEmail
                origin: form.fromLocation,                           // backend expects origin
                destination: form.toLocation,                        // backend expects destination
                departureAt: `${date}T${time}:00`,                   // LocalDateTime format
                totalSeats: Number(form.seatsAvailable),             // backend expects totalSeats
                price: Number(form.price),
                description: form.description || ""
            };

            await apiPost("/api/rides", payload);
            setSuccessModal(true);
        } catch (err) {
            console.error("Publish ride failed:", err);
            alert("Failed to publish ride");
        } finally {
            setLoading(false);
        }
    }

    const addPoint = (setter, list) => setter([...list, ""]);
    const updatePoint = (setter, list, idx, val) => {
        const newList = [...list];
        newList[idx] = val;
        setter(newList);
    };

    return (
        <div className="container" style={{ maxWidth: 800 }}>

            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; opacity: 0.6; }
            `}</style>

            <div className="card animate-fade">
                <h2 style={{ textAlign: "center", marginBottom: 30, color: 'var(--primary)' }}>Host a Ride</h2>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>

                    <div>
                        <label>Select Vehicle</label>
                        <select
                            value={selectedCarId}
                            onChange={(e) => {
                                if (e.target.value === 'add_new') setShowAddCar(true);
                                else setSelectedCarId(e.target.value);
                            }}
                        >
                            <option value="">-- Choose Car --</option>
                            {myCars.map(c => <option key={c.id} value={c.id}>{c.name} ({c.number})</option>)}
                            <option value="add_new" style={{fontWeight:'bold', color:'var(--primary)'}}>+ Add New Car</option>
                        </select>
                    </div>

                    <div>
                        <label>Upload Driver Photo</label>
                        <div className="file-input-wrapper">
                            <div className="file-btn"><Upload size={20} style={{marginBottom:5}}/><div>Click to Upload Image</div></div>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setForm({...form, driverPhotoUrl: url}))} />
                        </div>
                        {form.driverPhotoUrl && (
                            <img src={form.driverPhotoUrl} alt="Preview" style={{width:80, height:80, objectFit:'cover', marginTop:10, borderRadius:'50%', border:'2px solid var(--primary)'}} />
                        )}
                    </div>

                    <div className="grid-cols" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <label>From</label>
                            <div style={{position:'relative'}}><MapPin size={16} style={{position:'absolute', top:14, left:12, color:'gray'}}/><input style={{paddingLeft:40}} value={form.fromLocation} onChange={e=>setForm({...form, fromLocation: e.target.value})} required /></div>
                        </div>
                        <div>
                            <label>To</label>
                            <div style={{position:'relative'}}><MapPin size={16} style={{position:'absolute', top:14, left:12, color:'gray'}}/><input style={{paddingLeft:40}} value={form.toLocation} onChange={e=>setForm({...form, toLocation: e.target.value})} required /></div>
                        </div>
                    </div>

                    <div className="grid-cols" style={{ gridTemplateColumns: '1fr 1fr', alignItems:'start' }}>
                        <div>
                            <label>Pickup Points</label>
                            {pickupPoints.map((p, i) => (<input key={i} value={p} onChange={e=>updatePoint(setPickupPoints, pickupPoints, i, e.target.value)} placeholder={`Pickup ${i+1}`} style={{marginBottom:8}}/>))}
                            <button type="button" onClick={()=>addPoint(setPickupPoints, pickupPoints)} className="text-xs text-blue-400 hover:text-blue-300">+ Add Pickup Point</button>
                        </div>
                        <div>
                            <label>Dropoff Points</label>
                            {dropoffPoints.map((p, i) => (<input key={i} value={p} onChange={e=>updatePoint(setDropoffPoints, dropoffPoints, i, e.target.value)} placeholder={`Dropoff ${i+1}`} style={{marginBottom:8}}/>))}
                            <button type="button" onClick={()=>addPoint(setDropoffPoints, dropoffPoints)} className="text-xs text-blue-400 hover:text-blue-300">+ Add Dropoff Point</button>
                        </div>
                    </div>

                    <div className="grid-cols" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <label>Date</label>
                            <div style={{position:'relative', cursor:'pointer'}} onClick={() => dateRef.current?.showPicker()}>
                                <Calendar size={16} style={{position:'absolute', top:14, left:12, color:'gray', pointerEvents:'none'}}/>
                                <input ref={dateRef} type="date" style={{paddingLeft:40}} min={today} value={date} onChange={e => setDate(e.target.value)} required />
                            </div>
                        </div>
                        <div>
                            <label>Time</label>
                            <div style={{position:'relative', cursor:'pointer'}} onClick={() => timeRef.current?.showPicker()}>
                                <Clock size={16} style={{position:'absolute', top:14, left:12, color:'gray', pointerEvents:'none'}}/>
                                <input ref={timeRef} type="time" style={{paddingLeft:40}} value={time} onChange={e => setTime(e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700">
                        <h4 className="text-white font-bold mb-8 text-lg border-b border-gray-700 pb-4">Amenities</h4>
                        {/* simplified buttons, UI unchanged */}
                        <div className="space-y-6">
                            <div className="flex gap-8">
                                <button type="button" onClick={() => setForm({...form, features: {...form.features, ac: !form.features.ac}})}>{form.features.ac ? "AC ✓" : "AC"}</button>
                                <button type="button" onClick={() => setForm({...form, features: {...form.features, music: !form.features.music}})}>{form.features.music ? "Music ✓" : "Music"}</button>
                                <button type="button" onClick={() => setForm({...form, features: {...form.features, radio: !form.features.radio}})}>{form.features.radio ? "Radio ✓" : "Radio"}</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid-cols" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div><label>Seats</label><input type="number" min="1" max="8" value={form.seatsAvailable} onChange={e => setForm({...form, seatsAvailable: Number(e.target.value)})} required /></div>
                        <div><label>Price (₹)</label><input type="number" min="0" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} required /></div>
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Add any specific instructions..." style={{width:'100%', padding:12, minHeight:80}}/>
                    </div>

                    <div><label>Driver Name</label><input value={form.driverName} onChange={e => setForm({...form, driverName: e.target.value})} required /></div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: 10, padding: 16 }} disabled={loading}>
                        {loading ? "Publishing..." : "Publish Ride"}
                    </button>
                </form>
            </div>

            {showAddCar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Vehicle</h3>
                        <form onSubmit={handleAddCar} style={{marginTop:20}}>
                            <label>Car Name</label>
                            <input value={newCar.name} onChange={e=>setNewCar({...newCar, name: e.target.value})} required />
                            <label>Vehicle Number</label>
                            <input value={newCar.number} onChange={e=>setNewCar({...newCar, number: e.target.value})} required />
                            <label>Upload Car Photo</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setNewCar({...newCar, imageUrl: url}))} required />
                            {newCar.imageUrl && <img src={newCar.imageUrl} alt="Preview" style={{width:'100%', height:150, objectFit:'cover', marginTop:10}} />}
                            <div style={{display:'flex', gap:8, marginTop:12}}>
                                <button type="button" onClick={()=>setShowAddCar(false)} className="btn btn-secondary">Cancel</button>
                                <button className="btn btn-primary" type="submit">Save Car</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {successModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{textAlign:'center'}}>
                        <CheckCircle size={50} color="var(--success)" style={{margin:'0 auto 20px'}}/>
                        <h3>Ride Published!</h3>
                        <div style={{display:'flex', gap:10, marginTop:20}}>
                            <button className="btn btn-secondary" onClick={() => navigate('/')}>Home</button>
                            <button className="btn btn-primary" onClick={() => navigate('/rides/hosted')}>View Hosted</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
