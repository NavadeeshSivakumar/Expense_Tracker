import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-left">
        <span className="navbar-greeting">
          Good {getTimeOfDay()}, <strong>{user?.name}</strong>
        </span>
      </div>
      <div className="navbar-right">
        <div className="navbar-avatar" onClick={() => navigate("/profile")} title="Profile">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export default Navbar;