
import React, { useEffect, useState } from 'react';
import { getEmployeesByManager } from '../../services/userService';

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getEmployeesByManager();
        setEmployees(data);
      } catch (err) {
        setError('Failed to load employees.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Employees</h2>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : employees.length === 0 ? (
        <div className="text-gray-500">No employees found.</div>
      ) : (
        <ul>
          {employees.map(emp => (
            <li key={emp.id} className="mb-2">
              {emp.name || emp.email || emp.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeListPage;
