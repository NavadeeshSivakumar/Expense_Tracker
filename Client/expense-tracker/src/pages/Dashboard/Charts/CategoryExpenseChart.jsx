import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import axiosInstance from '../../../utils/axiosInstance';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CategoryChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;
        const res = await axiosInstance.get("/getExpenseByCategory", { params: { userId } });
        const categoryData = res.data; 
        const labels = Object.keys(categoryData);
        const values = Object.values(categoryData);

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#f87171", // red
                "#60a5fa", // blue
                "#34d399", // green
                "#fbbf24", // yellow
                "#a78bfa", // purple
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#888888", font: { size: 12 }, padding: 16 }
    },
    title: { display: false },
  },
};

  if (!chartData) return <p>Loading chart...</p>;

  return (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "280px" }}>
    <div style={{ width: "280px", height: "280px" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  </div>
  );
};

export default CategoryChart;
