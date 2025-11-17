import { NavLink } from 'react-router-dom'
import './Sidebar.css';

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Transactions", icon: "💳", path: "/transactions" }
    // { name: "Budgets", icon: "📊", path: "/budgets" },
    // { name: "Reports", icon: "📈", path: "/reports" },
  ];

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className="icon">{item.icon}</i>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
export default Sidebar;