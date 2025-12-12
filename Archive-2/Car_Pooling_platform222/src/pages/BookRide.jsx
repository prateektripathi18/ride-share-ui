// src/pages/BookRide.jsx

import React, { useState } from "react";
import { apiGet, apiPost } from "../api/api";
import { 
    X, MapPin, Calendar, Users, ArrowRight, DollarSign, 
    Clock, Plus, ChevronDown, Search, Bus, Car 
} from "lucide-react";

// ✅ IMPORT THE NEW RIDE CARD
import RideCard from "../components/RideCard";

export default function BookRide({ user }) {
    const [search, setSearch] = useState({ from: "Delhi", to: "Gurgaon" }); 
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedRide, setSelectedRide] = useState(null); 
    const [bookingSeats, setBookingSeats] = useState(1);
    const [bookingSuccess, setBookingSuccess] = useState("");

    // UTILITY FUNCTIONS
    const formatDateTime = (dateString) => {
        if (!dateString) return { date: "N/A", time: "N/A" };
        const d = new Date(dateString);
        return {
            date: d.toLocaleDateString("en-IN"),
            time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
    };

    const getRideIcon = (ride) => {
        if (ride.seatsAvailable > 4) 
            return <Bus size={40} className="text-blue-600 mr-4" />;
        return <Car size={40} className="text-gray-900 mr-4" />;
    };

    // SEARCH HANDLER
    const handleSearch = async () => {
        setLoading(true);
        setError("");
        setRides([]);
        setSelectedRide(null);
        setBookingSuccess("");

        try {
            const res = await apiGet(
                `/api/rides?origin=${encodeURIComponent(search.from)}&destination=${encodeURIComponent(search.to)}`
            );
            setRides(res || []);
            if (!res?.length) setError("No rides found for this route.");
        } catch (err) {
            console.error("Ride Search Error:", err);
            setError("Failed to load rides.");
        } finally {
            setLoading(false);
        }
    };

    // BOOK NOW BUTTON
    const handleBookNow = (ride) => {
        setSelectedRide(ride);
        setBookingSeats(1);
        setBookingSuccess("");
    };

    // BOOKING
    const handleBooking = async () => {
        if (!user?.email) return alert("Login required.");
        if (!selectedRide) return;

        try {
            const req = { passengerEmail: user.email, seats: Number(bookingSeats) };
            // await apiPost(`/api/rides/${selectedRide.id}/book`, req);

            setBookingSuccess("Booking successful!");
            setSelectedRide(null);
            setTimeout(handleSearch, 1000);
        } catch (err) {
            alert("Booking failed.");
        }
    };

    // DYNAMIC BUTTON LOGIC
    const getActionButtonProps = (ride) => {
        if (ride.seatsAvailable <= 0)
            return {
                text: "Sold Out",
                disabled: true,
                className:
                    "bg-red-500 text-white py-2 px-4 rounded-lg text-sm opacity-50 cursor-not-allowed",
            };

        return {
            text: "Book Now",
            disabled: false,
            onClick: (e) => {
                e.stopPropagation();
                handleBookNow(ride);
            },
        };
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-12">
            <div className="w-full max-w-7xl flex bg-white shadow-xl rounded-2xl overflow-hidden">

                {/* LEFT PANEL */}
                <div className="w-[35%] p-8">
                    <h2 className="text-xl font-bold mb-8 text-gray-800">Get a ride</h2>

                    <div className="mb-4 p-3 bg-gray-200 rounded-xl flex items-center">
                        <MapPin size={20} className="mr-3" />
                        <input
                            value={search.from}
                            onChange={(e) => setSearch({ ...search, from: e.target.value })}
                            className="bg-transparent w-full font-semibold"
                            placeholder="Where from?"
                        />
                    </div>

                    <div className="mb-10 p-3 bg-gray-200 rounded-xl flex items-center">
                        <MapPin size={20} className="mr-3" />
                        <input
                            value={search.to}
                            onChange={(e) => setSearch({ ...search, to: e.target.value })}
                            className="bg-transparent w-full font-semibold"
                            placeholder="Where to?"
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-full bg-black text-white py-3 rounded-xl flex justify-center gap-2"
                    >
                        {loading ? "Searching..." : <>Search Rides <Search size={20} /></>}
                    </button>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-[60%] p-8">
                    <h1 className="text-3xl font-bold">Choose a ride</h1>
                    <p className="text-gray-500 mb-6">Available long-distance journeys</p>

                    {error && <p className="text-red-500">{error}</p>}
                    {rides.length > 0 && (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {rides.map((ride) => (
                                <RideCard
                                    key={ride.id}
                                    ride={ride}
                                    isSelected={selectedRide?.id === ride.id}
                                    onSelect={() => setSelectedRide(ride)}
                                    actionButton={getActionButtonProps(ride)}
                                    formatDateTime={formatDateTime}
                                    getRideIcon={getRideIcon}
                                />
                            ))}
                        </div>
                    )}

                    {/* REQUEST BUTTON */}
                    <div className="mt-6 border-t pt-4 flex justify-between">
                        <div className="flex items-center text-gray-700">
                            <Plus size={16} className="mr-2" /> Add payment method
                            <ChevronDown size={16} className="ml-2" />
                        </div>

                        <button
                            disabled={!selectedRide}
                            onClick={() => handleBookNow(selectedRide)}
                            className="bg-black text-white px-8 py-3 rounded-xl disabled:bg-gray-400"
                        >
                            Request Ride
                        </button>
                    </div>
                </div>
            </div>

            {/* BOOKING MODAL */}
            {selectedRide && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg relative">
                        <button className="absolute top-4 right-4" onClick={() => setSelectedRide(null)}>
                            <X size={24} className="text-white" />
                        </button>

                        <h2 className="text-2xl text-white font-bold">Confirm Booking</h2>
                        <p className="text-blue-400 text-lg mb-4">
                            {selectedRide.origin} → {selectedRide.destination}
                        </p>

                        <button
                            onClick={handleBooking}
                            className="w-full mt-6 bg-blue-600 text-white rounded-xl py-3"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
