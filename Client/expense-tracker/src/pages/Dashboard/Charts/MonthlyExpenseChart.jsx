import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyExpensesChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;
        const res = await axios.get("http://localhost:8080/getMonthlyExpenses", {
          params: { userId },
        });
        const monthlyData = res.data;
        const expensesArray = Array.from({ length: 12 }, (_, i) => monthlyData[i + 1] || 0);

        setChartData({
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Monthly Expenses",
              data: expensesArray,
              fill: false,
              borderColor: "#3b82f6",
              backgroundColor: "#3b82f6",
              tension: 0.2,
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
      legend: { display: true, position: "top" },
      title: { display: true, text: "Monthly Expenses" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyExpensesChart;
