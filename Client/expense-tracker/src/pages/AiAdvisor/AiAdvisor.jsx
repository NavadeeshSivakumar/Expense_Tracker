import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AiAdvisor.css";

export default function AiAdvisor() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isPro = user?.plan === "PRO";
  const navigate = useNavigate();

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`chat_history_${user?.id}`);
    return saved ? JSON.parse(saved) : [
      {
        role: "assistant",
        content: `Hi ${user?.name?.split(" ")[0]}! I'm your Sorted AI advisor. Ask me anything about your finances — spending patterns, savings tips, or budget advice.`
      }
    ];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem(`chat_history_${user?.id}`, JSON.stringify(messages));
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        user_id: user.id,
        message: input,
        history: messages
      });

      setMessages([...updatedMessages, {
        role: "assistant",
        content: res.data.response
      }]);
    } catch (err) {
      setMessages([...updatedMessages, {
        role: "assistant",
        content: "Sorry, I couldn't process that. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isPro) {
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

  return (
    <div className="ai-container">
      <div className="ai-header">
        <h2 className="ai-title">AI Advisor</h2>
        <span className="ai-subtitle">Your personal financial co-pilot</span>
      </div>

      <div className="chat-wrapper">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="chat-avatar">
                  <i className="ti ti-robot" aria-hidden="true"></i>
                </div>
              )}
              <div className="chat-bubble">
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="chat-avatar user">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant">
              <div className="chat-avatar">
                <i className="ti ti-robot" aria-hidden="true"></i>
              </div>
              <div className="chat-bubble typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-row">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask anything about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <i className="ti ti-send" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}