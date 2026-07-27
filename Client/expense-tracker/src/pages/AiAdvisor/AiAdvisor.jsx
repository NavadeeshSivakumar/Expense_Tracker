import { useNavigate } from "react-router-dom";
import "./AiAdvisor.css";

export default function AiAdvisor() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isPro = user?.plan === "PRO";
  const navigate = useNavigate();

  if (isPro) {
    return (
      <div className="ai-container">
        <div className="ai-header">
          <h2 className="ai-title">AI Advisor</h2>
          <span className="ai-subtitle">Your personal financial co-pilot</span>
        </div>
        <div className="ai-coming-soon">
          <i className="ti ti-robot" aria-hidden="true"></i>
          <h3>Coming soon</h3>
          <p>The AI advisor is being set up for your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-container">
      <div className="ai-header">
        <h2 className="ai-title">AI Advisor</h2>
        <span className="ai-subtitle">Your personal financial co-pilot</span>
      </div>

      <div className="ai-locked">
        <div className="ai-locked-card">
          <div className="ai-locked-icon">
            <i className="ti ti-lock" aria-hidden="true"></i>
          </div>
          <h3>This is a Pro feature</h3>
          <p>Upgrade to Pro to unlock your AI financial advisor — ask questions, get insights, and understand your spending like never before.</p>

          <div className="ai-feature-list">
            <div className="ai-feature">
              <i className="ti ti-message-circle" aria-hidden="true"></i>
              <span>Ask anything about your finances</span>
            </div>
            <div className="ai-feature">
              <i className="ti ti-chart-line" aria-hidden="true"></i>
              <span>Get personalized spending insights</span>
            </div>
            <div className="ai-feature">
              <i className="ti ti-file-report" aria-hidden="true"></i>
              <span>Monthly AI generated financial report</span>
            </div>
            <div className="ai-feature">
              <i className="ti ti-upload" aria-hidden="true"></i>
              <span>Upload and parse bank statements</span>
            </div>
          </div>

          <div className="ai-upgrade-price">
            <span className="ai-price">₹199</span>
            <span className="ai-price-period">/month</span>
          </div>

          <button className="ai-upgrade-btn" onClick={() => navigate("/profile")}>
            <i className="ti ti-crown" aria-hidden="true"></i>
            Upgrade to Pro
          </button>

          <p className="ai-upgrade-note">Payment integration coming soon</p>
        </div>
      </div>
    </div>
  );
}