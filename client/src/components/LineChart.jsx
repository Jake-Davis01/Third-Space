import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

// register chart parts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ data }) {
  const chartData = {
    labels: data?.map(d => d.month_label),
    datasets: [
      {
        label: "Users Registered",
        data: data?.map(d => Number(d.cumulative_users)),
        borderColor: "blue",
        backgroundColor: "rgba(255, 239, 15, 0.2)",
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ width: "780px", height: "400px" }}>
      <Line data={chartData} />
    </div>
  );
}

export default LineChart;