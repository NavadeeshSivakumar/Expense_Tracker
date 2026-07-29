import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';
import "./Dashboard.css";
import MonthlyExpensesChart from "./Charts/MonthlyExpenseChart";
import CategoryChart from "./Charts/CategoryExpenseChart";
import axios from "axios";

function Dashboard() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await axiosInstance.get("/getIncomeByUserId", { params: { userId } });
        const expenseResponse = await axiosInstance.get("/getExpenseByUserId", { params: { userId } });
        setIncome(incomeResponse.data || 0);
        setExpense(expenseResponse.data || 0);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const fetchInsights = async () => {
      setInsightsLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/insights/${userId}`);
        setInsights(res.data.insights);
      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setInsightsLoading(false);
      }
    };

fetchInsights();
  }, []);

  const balance = income - expense;
  const isEmpty = income === 0 && expense === 0;

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <span className="dashboard-subtitle">Your financial overview</span>
      </div>

      {loading ? (
        <div className="dashboard-loading">Loading...</div>
      ) : isEmpty ? (
        <div className="dashboard-empty">
          <i className="ti ti-chart-bar-off" aria-hidden="true"></i>
          <h3>No data yet</h3>
          <p>Add your first transaction to see your financial overview</p>
          <button className="empty-add-btn" onClick={() => navigate("/transactions")}>
            <i className="ti ti-plus" aria-hidden="true"></i>
            Add transaction
          </button>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card income">
              <div className="stat-icon">
                <i className="ti ti-trending-up" aria-hidden="true"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Total income</span>
                <span className="stat-value income-value">₹{income.toLocaleString()}</span>
              </div>
            </div>

            <div className="stat-card expense">
              <div className="stat-icon">
                <i className="ti ti-trending-down" aria-hidden="true"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Total expenses</span>
                <span className="stat-value expense-value">₹{expense.toLocaleString()}</span>
              </div>
            </div>

            <div className="stat-card balance">
              <div className="stat-icon">
                <i className="ti ti-wallet" aria-hidden="true"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Balance</span>
                <span className={`stat-value ${balance >= 0 ? "income-value" : "expense-value"}`}>
                  ₹{Math.abs(balance).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-card-header">
                <span className="chart-card-title">Monthly expenses</span>
              </div>
              <MonthlyExpensesChart />
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <span className="chart-card-title">Expenses by category</span>
              </div>
              <CategoryChart />
            </div>
          </div>

          <div className="insights-card">
            <div className="insights-header">
              <div className="insights-title-row">
                <i className="ti ti-sparkles" aria-hidden="true"></i>
                <span className="insights-title">AI Insights</span>
              </div>
              <span className="insights-badge">Powered by AI</span>
            </div>

            {insightsLoading ? (
              <p className="insights-loading">Analysing your finances...</p>
            ) : insights.length === 0 ? (
              <p className="insights-empty">Add more transactions to get personalised insights.</p>
            ) : (
              <div className="insights-list">
                {insights.map((insight, index) => (
                  <div key={index} className="insight-item">
                    <div className="insight-number">{index + 1}</div>
                    <p className="insight-text">{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;