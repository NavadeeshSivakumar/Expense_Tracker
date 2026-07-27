import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        Sort<span>ed</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <i className="ti ti-layout-dashboard" aria-hidden="true"></i>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <i className="ti ti-arrows-exchange" aria-hidden="true"></i>
          Transactions
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/profile" className="sidebar-profile-link">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user">
            <span className="sidebar-username">{user?.name}</span>
            <span className="sidebar-email">{user?.email}</span>
          </div>
        </NavLink>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <i className="ti ti-logout" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;