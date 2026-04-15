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

function LineChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Users Regiestered",
        data: [60, 65, 68, 70, 95],
        borderColor: "blue",
        backgroundColor: "rgba(255, 239, 15, 0.2)",
        tension: 0.3   // smooth curve
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ width: "780px", height: "400px" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default LineChart;