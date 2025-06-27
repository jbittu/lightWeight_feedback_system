import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { jwtDecode } from "jwt-decode";  

import { useAuth } from "../components/context/AuthContext"; 

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await loginUser(formData);  // ✅ makes request
    const token = res.access_token;
    login(token);  // ✅ saves + sets user

    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);

    const role = decoded.role;
    if (role === "manager") {
      navigate("/manager/dashboard");
    } else if (role === "employee") {
      navigate("/employee/timeline");
    } else {
      setError("Unknown role. Contact admin.");
    }
  } catch (err) {
    console.error(err);
    setError("Invalid credentials. Please try again.");
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-md"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-md"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Log In
        </button>
        <p className="mt-3">
          Don’t have an account? <a href="/register" className="text-blue-600">Register</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
