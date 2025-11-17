// import './Navbar.css';
// import { NavLink } from 'react-router-dom';

// function Navbar() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   return (
//     <nav className='navbar'>
//         <div className='navbar-left'>
//             <NavLink to = '/dashboard'style={{textDecoration:"none", color:"white"}} ><h1 className='logo'>Expense Tracker</h1></NavLink>
//         </div>
//         <div className='navbar-right'>
//             <div className='user-info'>
//                 <span className='icon'>🤑</span>
//                 <span className='username'>{user.name}</span>
//             </div>
//         </div>
//     </nav>
//   )
// }

// export default Navbar

import './Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className='navbar'>
      <div className='navbar-left'>
        <NavLink 
          to='/dashboard'
          style={{ textDecoration: "none", color: "white" }}
        >
          <h1 className='logo'>Expense Tracker</h1>
        </NavLink>
      </div>

      <div className='navbar-right'>
        <div className='user-info' ref={dropdownRef}>
          <span className='icon'>🤑</span>
          <span 
            className='username' 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ cursor: 'pointer' }}
          >
            {user.name} 
          </span>

          {dropdownOpen && (
            <div className='dropdown-menu'>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


