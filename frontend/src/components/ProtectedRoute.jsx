import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext"; 

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  console.log("🔐 ProtectedRoute User:", user); 

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    console.warn(`Unauthorized: Required ${allowedRole}, but found ${user.role}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
