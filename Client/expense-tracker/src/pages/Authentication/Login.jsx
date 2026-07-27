import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/login", { email, password });
      const { token, userId, name, email: userEmail, plan } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ id: userId, name, email: userEmail, plan }));
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Invalid email or password";
      alert(message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Sort<span style={{ color: "#6366f1" }}>ed</span></h1>
      </div>

      <div className="auth-card">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ textAlign: "right", marginTop: "-8px" }}>
            <span
              onClick={() => navigate("/forgot-password", { state: { email } })}
              style={{ fontSize: "12px", color: "#6366f1", cursor: "pointer" }}
            >
              Forgot password?
            </span>
          </div>

          <button type="submit">Login</button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;