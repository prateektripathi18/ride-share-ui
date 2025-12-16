import axios from "axios";

const API_URL = "http://localhost:8080/api/rides"; // CHANGE IF NEEDED

// POST: Host a Ride
export const hostRide = async (rideData) => {
  return await axios.post(`${API_URL}/host`, rideData);
};

// POST: Book a Ride
export const bookRide = async (rideId, userData) => {
  return await axios.post(`${API_URL}/book/${rideId}`, userData);
};

// GET: All Rides
export const getAllRides = async () => {
  return await axios.get(`${API_URL}`);
};

// GET: Ride by ID
export const getRideById = async (rideId) => {
  return await axios.get(`${API_URL}/${rideId}`);
};
