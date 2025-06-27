import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEmployeesByManager } from "../../services/userService";
import { getCurrentUser } from "../../services/authService";

const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        const employeesData = await getEmployeesByManager();
        setEmployees(employeesData);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {employees.length > 0 && (
              <Link
                to={`/manager/feedback/${employees[0].id}`}
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Submit New Feedback
              </Link>
            )}
            <Link
              to="/manager/employees"
              className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              View All Employees
            </Link>
            <Link
              to="/manager/feedbacks"
              className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              View My Feedbacks
            </Link>
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Employees:</span>
              <span className="font-semibold">{employees.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Employees:</span>
              <span className="font-semibold">{employees.length}</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Employees</h3>
          <Link
            to="/manager/employees"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View All →
          </Link>
        </div>

        {employees.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
            <p>No employees assigned to you yet.</p>
            <p className="text-sm mt-2">
              Contact your administrator to get employees assigned.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.slice(0, 6).map((employee) => (
              <div
                key={employee.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{employee.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Employee
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{employee.email}</p>
                <Link
                  to={`/manager/feedback/${employee.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Submit Feedback →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
