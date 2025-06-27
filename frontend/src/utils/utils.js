// src/utils/utils.js

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// --- Token Management ---
const TOKEN_KEY = "access_token";

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

// --- Role Checks ---
export const isManager = (role) => role === "manager";
export const isEmployee = (role) => role === "employee";

// --- Date Formatting ---
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

// --- Auth Hook ---
export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // includes: { sub, role, exp }
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    saveToken(token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return { user, login, logout };
}
