import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../Authentication/Auth.css";

function ForgotPassword() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/forgotPassword", { email });
      setMessage({ type: "success", text: "Reset link sent — check your email" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Sort<span style={{ color: "#6366f1" }}>ed</span></h1>
      </div>

      <div className="auth-card">
        <h2>Reset password</h2>
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px", marginTop: "-8px" }}>
          Enter your email and we'll send you a reset link
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
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

          {message && (
            <div style={{
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              background: message.type === "success" ? "#0d2b1e" : "#2b0d0d",
              color: message.type === "success" ? "#34d399" : "#f87171"
            }}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;