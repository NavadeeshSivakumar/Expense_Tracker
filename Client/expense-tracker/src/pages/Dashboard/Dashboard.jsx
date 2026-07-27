import React, { useEffect, useState } from "react";
import axiosInstance from '../../utils/axiosInstance';
import "./Dashboard.css";
import MonthlyExpensesChart from "./Charts/MonthlyExpenseChart";
import CategoryChart from "./Charts/CategoryExpenseChart";

function Dashboard() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

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
  }, []);

  const balance = income - expense;

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <span className="dashboard-subtitle">Your financial overview</span>
      </div>

      {loading ? (
        <div className="dashboard-loading">Loading...</div>
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
        </>
      )}
    </div>
  );
}

export default Dashboard;