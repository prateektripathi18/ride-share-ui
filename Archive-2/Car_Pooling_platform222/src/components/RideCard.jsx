import React, { useEffect, useState } from "react";
import { ArrowRight, Clock, Calendar, Users, DollarSign, MapPin } from "lucide-react";
import { apiGet } from "../api/api";

export default function RideCard({
    ride,
    isSelected,
    onSelect,
    actionButton,
    formatDateTime,
    getRideIcon = () => <span className="w-6 h-6 bg-gray-300 rounded-full mr-3"></span> // fallback icon
}) {
    const { date, time } = formatDateTime(ride.departureAt);
    const isAvailable = ride.seatsAvailable > 0;

    // Distance state
    const [distance, setDistance] = useState(null);

    // Load distance from backend
    useEffect(() => {
        let mounted = true;
        async function loadDistance() {
            try {
                const d = await apiGet(`/api/rides/${ride.id}/distance`);
                if (mounted) setDistance(d);
            } catch (err) {
                console.error("Failed to load distance for ride ID", ride.id, err);
            }
        }
        loadDistance();
        return () => { mounted = false; };
    }, [ride.id]);

    const cardStyle = `
        flex items-center justify-between py-6 px-5 mb-4 rounded-xl cursor-pointer
        transition-all duration-300
        ${isAvailable 
            ? (isSelected ? "border-2 border-black bg-gray-50 shadow-lg" : "border border-gray-200 hover:bg-gray-100") 
            : "border border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"}
    `;

    return (
        <div className={cardStyle} onClick={isAvailable ? onSelect : undefined}>
            
            {/* LEFT SIDE */}
            <div className="flex items-start flex-grow pr-4">
                {getRideIcon(ride)}

                <div className="flex flex-col">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                        {ride.origin} 
                        <ArrowRight size={18} className="inline mx-1 text-blue-600"/> 
                        {ride.destination}
                    </h3>

                    {/* Distance */}
                    <div className="flex items-center text-sm text-gray-700 mb-2">
                        <MapPin size={16} className="mr-1 text-red-500" />
                        {distance !== null ? (
                            <span className="font-semibold">{distance} km</span>
                        ) : (
                            <span className="text-gray-400">Calculating...</span>
                        )}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2">
                        <div className="flex items-center">
                            <Clock size={16} className="mr-1 text-gray-500"/>
                            <span className="font-semibold">{time}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar size={16} className="mr-1 text-gray-500"/>
                            <span className="font-semibold">{date}</span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Users size={16} className="mr-1 text-gray-500"/>
                        <span className={`font-bold ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                            {ride.seatsAvailable} Seats Left
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col items-end pt-1 ml-4">
                <span className="text-3xl font-extrabold text-gray-900 mb-3 flex items-center">
                    <DollarSign size={20} className="text-green-600 mr-1" />
                    {ride.price}
                </span>

                {/* Dynamic Action Button */}
                <button
                    className={actionButton.className}
                    disabled={actionButton.disabled}
                    onClick={(e) => {
                        e.stopPropagation();
                        actionButton.onClick && actionButton.onClick(e);
                    }}
                >
                    {actionButton.text}
                </button>
            </div>

        </div>
    );
}
