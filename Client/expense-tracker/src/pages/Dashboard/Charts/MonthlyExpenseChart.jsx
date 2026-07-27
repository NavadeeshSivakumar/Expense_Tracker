import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from '../../../utils/axiosInstance';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const MonthlyExpensesChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;
        const res = await axiosInstance.get("/getMonthlyExpenses", { params: { userId } });
        const monthlyData = res.data;
        const expensesArray = Array.from({ length: 12 }, (_, i) => monthlyData[i + 1] || 0);

        setChartData({
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Monthly Expenses",
              data: expensesArray,
              fill: false,
              borderColor: "#6366f1",
              backgroundColor: "#6366f1",
              tension: 0.3,
              pointBackgroundColor: "#6366f1",
              pointRadius: 4,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching monthly expenses:", err);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: "#888888", font: { size: 12 } }
      },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#1e1e1e" },
        ticks: { color: "#555555" },
      },
      x: {
        grid: { color: "#1e1e1e" },
        ticks: { color: "#555555" },
      },
    },
  };

  if (!chartData) return <p style={{ color: "#555", fontSize: "13px" }}>Loading chart...</p>;

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyExpensesChart;