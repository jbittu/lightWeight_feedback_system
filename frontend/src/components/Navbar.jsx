import { Link } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between p-4 bg-blue-600 text-white">
      <div className="font-bold text-xl">Feedback System</div>
      <div className="flex gap-4">
        {user ? (
          <>
            {user.role === "manager" && <Link to="/manager/dashboard">Dashboard</Link>}
            {user.role === "employee" && <Link to="/employee/feedbacks">My Feedback</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
