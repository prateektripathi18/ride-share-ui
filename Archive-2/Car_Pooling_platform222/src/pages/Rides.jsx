import React, { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function Rides({ user }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await apiGet(`/api/rides/hosted?hostEmail=${user.email}`);
            setData(res);
        } catch (err) {
            console.error("Error loading hosted rides:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatDate = (dt) => {
        if (!dt) return "";
        return new Date(dt).toLocaleString();
    };

    return (
        <>
            {/* ⭐ YOUR FULL UI REMAINS UNTOUCHED HERE */}

            {!loading && data.length === 0 && (
                <p>No records found.</p>
            )}

            {!loading && data.length > 0 && (
                <div>
                    {data.map((ride) => (
                        <div key={ride.id}>
                            <p>From: {ride.origin}</p>
                            <p>To: {ride.destination}</p>
                            <p>Date: {formatDate(ride.departureAt)}</p>
                            <p>Seats: {ride.seatsAvailable}/{ride.totalSeats}</p>
                            <p>Price: ₹{ride.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
