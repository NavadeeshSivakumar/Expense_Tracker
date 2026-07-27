import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./Profile.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/getUser/${userId}`);
        setProfile(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axiosInstance.put(`/updateProfile/${userId}`, { name, email });
      localStorage.setItem("user", JSON.stringify({ ...user, name: res.data.name, email: res.data.email }));
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        setPasswordMessage({ type: "error", text: "New passwords don't match" });
        return;
    }
    if (newPassword.length < 6) {
        setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
        return;
    }
    setChangingPassword(true);
    try {
        await axiosInstance.put(`/changePassword/${userId}`, {
        currentPassword,
        newPassword
        });
        setPasswordMessage({ type: "success", text: "Password changed successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    } catch (err) {
        setPasswordMessage({ type: "error", text: err.response?.data || "Failed to change password" });
    } finally {
        setChangingPassword(false);
        setTimeout(() => setPasswordMessage(null), 3000);
    }
    };

  if (!profile) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">Profile</h2>
        <span className="profile-subtitle">Manage your account settings</span>
      </div>

      <div className="profile-grid">

        {/* User Info */}
        <div className="profile-card">
        <div className="profile-card-header">
            <i className="ti ti-user-circle" aria-hidden="true"></i>
            <span>Personal information</span>
        </div>

        <div className="profile-avatar-row">
            <div className="profile-avatar">
            {name?.charAt(0).toUpperCase()}
            </div>
            <div>
            <p className="profile-name">{profile.name}</p>
            <p className="profile-email">{profile.email}</p>
            </div>
        </div>

        <form className="profile-form" onSubmit={handleSave}>
            <div className="form-group">
            <label>Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            </div>
            <div className="form-group">
            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>

            {message && (
            <div className={`profile-message ${message.type}`}>
                {message.text}
            </div>
            )}

            <button type="submit" className="btn-save" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
            </button>
        </form>

        <div className="card-divider" />

        <button
            className="btn-toggle-password"
            onClick={() => {
            setShowPasswordFields(!showPasswordFields);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordMessage(null);
            }}
        >
            <i className={`ti ${showPasswordFields ? "ti-chevron-up" : "ti-lock"}`} aria-hidden="true"></i>
            {showPasswordFields ? "Cancel" : "Change password"}
        </button>

        {showPasswordFields && (
            <form className="profile-form" style={{ marginTop: "16px" }} onSubmit={handleChangePassword}>
            <div className="form-group">
                <label>Current password</label>
                <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                />
            </div>
            <div className="form-group">
                <label>New password</label>
                <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                />
            </div>
            <div className="form-group">
                <label>Confirm new password</label>
                <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
            </div>

            {passwordMessage && (
                <div className={`profile-message ${passwordMessage.type}`}>
                {passwordMessage.text}
                </div>
            )}

            <button type="submit" className="btn-save" disabled={changingPassword}>
                {changingPassword ? "Changing..." : "Update password"}
            </button>
            </form>
        )}
        </div>

        {/* Subscription */}
        <div className="profile-card">
          <div className="profile-card-header">
            <i className="ti ti-crown" aria-hidden="true"></i>
            <span>Subscription</span>
          </div>

          <div className="current-plan">
            <div className="plan-badge-row">
              <span className={`plan-badge ${profile.plan?.toLowerCase()}`}>
                {profile.plan === "PRO" ? "Pro" : "Free"}
              </span>
              <span className="plan-status">Current plan</span>
            </div>
            <p className="plan-desc">
              {profile.plan === "PRO"
                ? "You have full access to all features including AI advisor."
                : "Upgrade to Pro to unlock the AI financial advisor."}
            </p>
          </div>

          <div className="plan-comparison">
            <div className="plan-feature">
              <i className="ti ti-check" aria-hidden="true"></i>
              <span>Unlimited transactions</span>
            </div>
            <div className="plan-feature">
              <i className="ti ti-check" aria-hidden="true"></i>
              <span>Dashboard and charts</span>
            </div>
            <div className={`plan-feature ${profile.plan !== "PRO" ? "locked" : ""}`}>
              {profile.plan === "PRO"
                ? <i className="ti ti-check" aria-hidden="true"></i>
                : <i className="ti ti-lock" aria-hidden="true"></i>}
              <span>AI financial advisor</span>
            </div>
            <div className={`plan-feature ${profile.plan !== "PRO" ? "locked" : ""}`}>
              {profile.plan === "PRO"
                ? <i className="ti ti-check" aria-hidden="true"></i>
                : <i className="ti ti-lock" aria-hidden="true"></i>}
              <span>Monthly AI insights report</span>
            </div>
          </div>

          {profile.plan !== "PRO" && (
            <div className="upgrade-section">
              <div className="upgrade-price">
                <span className="price">₹199</span>
                <span className="price-period">/month</span>
              </div>
              <button className="btn-upgrade">
                <i className="ti ti-crown" aria-hidden="true"></i>
                Upgrade to Pro
              </button>
              <p className="upgrade-note">Payment integration coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}