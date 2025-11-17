import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [match, setMatch] = useState(true);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      setMatch(false);
      return;
    }
    try 
    {
      await axios.post("http://localhost:8080/addUser",
        {
          name : username,
          email : email,
          password : password
        }
      );
      alert('Signup successful!');
      navigate('/');
    }
    catch(error)
    {
      console.error(error);
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>SmartExpense</h1>
      </div>
      <div className="auth-card">
        <h2>Create Account</h2>
        <form className="auth-form" onSubmit={handleSignup}>
          <div>
            <label>Username : </label>
            <input
              type="text"
              placeholder="Enter your name"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <div>
            <label>Confirm Password : </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              required
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
          </div>
          {!match && <p className="error-text">Passwords don’t match</p>}
          <button type="submit">Signup</button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate('/')}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
