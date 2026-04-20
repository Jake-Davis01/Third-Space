import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Colors,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Colors,
  Legend
);

function BarChart({ data, title }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#0B0033",
          font: { family: "Poppins", weight: "600" },
        }
      },
      title: {
        display: true,
        text: title,
        color: "#0B0033",
        font: { family: "Poppins", size: 14, weight: "700" },
      }
    },
    scales: {
      x: {
        ticks: { color: "#3e3e3e", font: { family: "Poppins", weight: "600" } },
        grid: { color: "#cbcaca" },
      },
      y: {
        ticks: { color: "#0B0033", font: { family: "Poppins", weight: "600" } },
        grid: { color: "#cbcaca" },
      }
    }
  };

  return (
    <div style={{ height: "400px", width: "780px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;