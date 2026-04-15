import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

// register required chart parts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart({ data, title }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: title
      }
    }
  };

  return (
    <div style={{ height: 300, width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;