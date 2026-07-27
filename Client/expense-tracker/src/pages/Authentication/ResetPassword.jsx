import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../Authentication/Auth.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      setMessage({ type: "error", text: "Passwords don't match" });
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/resetPassword", { token, newPassword: password });
      setMessage({ type: "success", text: "Password reset successful — redirecting to login" });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data || "Invalid or expired link" });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p style={{ color: "#f87171", fontSize: "13px" }}>Invalid reset link.</p>
          <button className="secondary-btn" onClick={() => navigate("/")}>Back to login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Sort<span style={{ color: "#6366f1" }}>ed</span></h1>
      </div>

      <div className="auth-card">
        <h2>New password</h2>
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px", marginTop: "-8px" }}>
          Enter a new password for your account
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label>New password</label>
            <input
              type="password"
              placeholder="Enter new password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              required
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
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
            {loading ? "Resetting..." : "Reset password"}
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

export default ResetPassword;