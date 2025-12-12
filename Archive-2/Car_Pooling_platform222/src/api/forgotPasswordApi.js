import axios from "axios";

const BASE_URL = "http://localhost:8080/forgotPassword"; // Update if your backend runs on another port

export const sendOtp = (email) => {
  return axios.post(`${BASE_URL}/verifyMail/${email}`);
};

export const verifyOtp = (email, otp) => {
  return axios.post(`${BASE_URL}/verifyOtp/${otp}/${email}`);
};

export const changePassword = (email, password, repeatpassword) => {
  return axios.post(`${BASE_URL}/changePassword/${email}`, {
    password,
    repeatpassword,
  });
};
 
