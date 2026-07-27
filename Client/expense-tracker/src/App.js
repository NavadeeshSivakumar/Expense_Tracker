import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import Transactions from "./pages/Transactions/Transactions";
import Dashboard from "./pages/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import AiAdvisor from "./pages/AiAdvisor/AiAdvisor";
import "./Layout.css";

function Layout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const hideLayout = location.pathname === "/" || 
                   location.pathname === "/signup" || 
                   location.pathname === "/forgot-password" ||
                   location.pathname === "/reset-password";

  if (!user && !hideLayout) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="app-container">
      {!hideLayout && <Navbar />}
      <div className="main-container">
        {!hideLayout && <Sidebar />}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/ai-advisor" element={<AiAdvisor />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
