import React, { useEffect, useState } from "react";
import axios from "axios";
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
      const incomeResponse = await axios.get("http://localhost:8080/getIncomeByUserId" ,
   { params : {userId} });
      const expenseResponse = await axios.get("http://localhost:8080/getExpenseByUserId" ,
   { params : {userId} });

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

  return (
    <div className="dashboard-main">
      <h2 className="dashboard-title">Dashboard</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="dashboard-grid">
          <div className="card income-card">
            <h3>Total Income</h3>
            <p className="card-value">₹{income}</p>
          </div>

          <div className="card expense-card">
            <h3>Total Expense</h3>
            <p className="card-value">₹{expense}</p>
          </div>

          <div className="card chart-card">
            <h3>Monthly Expenses</h3>
            <div className="chart-placeholder"><MonthlyExpensesChart/></div>
          </div>

          <div className="card chart-card">
            <h3>Expenses by Category</h3>
            <div className="chart-placeholder"><CategoryChart/></div>
          </div>
        </div>
      )}
    </div>  );
}

export default Dashboard;
