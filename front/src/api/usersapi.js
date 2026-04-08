// src/api/usersapi.js
import axios from "axios";

// ✅ Create a base Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api/user",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Register user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error.response ? error.response.data : "Registration failed";
  }
};

// ✅ Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    // ⚠️ Later, if backend sends JWT, store it here:
    // localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : "Login failed";
  }
};

// ✅ Get user profile (optional, if JWT is used later)
export const getUserProfile = async (email) => {
  try {
    const response = await api.get(`/profile/${email}`);
    return response.data;
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error.response ? error.response.data : "Profile not found";
  }
};

// ✅ Get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get("/all"); // must exist in backend
    return response.data;
  } catch (error) {
    console.error("Fetch users error:", error);
    throw error.response ? error.response.data : "Cannot fetch users";
  }
};


export default api;
