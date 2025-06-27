import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Manager Pages
import ManagerDashboard from "./pages/managerPages/ManagerDashboard";
import EmployeeListPage from "./pages/managerPages/EmployeeListPage";
import FeedbackFormPage from "./pages/managerPages/FeedbackFormPage";

// Employee Pages
import EmployeeTimeline from "./pages/employeePages/EmployeeTimeline";
import AcknowledgePage from "./pages/employeePages/AcknowledgePage";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import ManagerFeedbackListPage from "./pages/managerPages/ManagerFeedbackListPage";
import EditFeedbackPage from "./pages/managerPages/EditFeedbackPage";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/employees"
          element={
            <ProtectedRoute allowedRole="manager">
              <EmployeeListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/feedback/:employeeId"
          element={
            <ProtectedRoute allowedRole="manager">
              <FeedbackFormPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/manager/feedbacks"
          element={
            <ProtectedRoute allowedRole="manager">
              <ManagerFeedbackListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/feedback/edit/:feedbackId"
          element={
            <ProtectedRoute allowedRole="manager">
              <EditFeedbackPage />
            </ProtectedRoute>
          }
        />
        {/* Protected Employee Routes */}
        <Route
          path="/employee/timeline"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeTimeline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/acknowledge/:feedbackId"
          element={
            <ProtectedRoute allowedRole="employee">
              <AcknowledgePage />
            </ProtectedRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
