// src/components/EmployeeCard.jsx
import { Link } from "react-router-dom";

const EmployeeCard = ({ employee }) => {
  return (
    <div className="border p-4 rounded-xl shadow">
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <Link to={`/manager/feedback/${employee.id}`} className="text-blue-600 underline">
        Give Feedback
      </Link>
    </div>
  );
};

export default EmployeeCard;