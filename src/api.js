import axios from "axios";

const API = axios.create({
  baseURL: "https://reactlogin-hovt.onrender.com/api", // Replace with your backend
});

// Example requests
export const loginUser = (data) => API.post("/login", data);
export const signupUser = (data) => API.post("/signup", data);
export const forgotPassword = (data) => API.post("/forgot-password", data);
