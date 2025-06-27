// src/services/authService.js
import API from "./api";

// Login (used internally)
export const login = async (email, password) => {
  const data = new URLSearchParams();
  data.append("username", email);
  data.append("password", password);

  const response = await API.post("/auth/login", data);
  return response.data;
};

// Login alias for LoginPage
export const loginUser = async (formData) => {
  return await login(formData.username, formData.password);
};

// Register
export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData);
  return res.data;
};

// Get currently logged-in user
export const getCurrentUser = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

// ✅ Get all managers (for employee registration)
export const getManagers = async () => {
  const response = await API.get("/auth/managers");
  return response.data;
};
