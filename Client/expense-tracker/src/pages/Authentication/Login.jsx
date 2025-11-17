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
      const response = await axios.get("http://localhost:8080/getUserByEmail", {
        params: { email, password },
      });

      const user = response.data;
      if (user) {
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(user));
        navigate('/dashboard');
      } else {
        alert("Invalid email or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>SmartExpense</h1>
      </div>

      <div className="auth-card">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div>
            <label>Email : </label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password : </label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
