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
        borderColor: "#9333ea",
        backgroundColor: "rgba(147, 51, 234, 0.15)",
        pointBackgroundColor: "#0B0033",
        pointBorderColor: "#c084fc",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#c084fc",
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#0B0033",
          font: { family: "Poppins", weight: "600" },
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#3e3e3e", font: { family: "Poppins", weight: "600" } },
        grid: { color: "#cbcaca" },
      },
      y: {
        ticks: { color: "#3e3e3e", font: { family: "Poppins", weight: "600" } },
        grid: { color: "#cbcaca" },
      }
    }
  };

  return (
    <div style={{ width: "780px", height: "400px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default LineChart;