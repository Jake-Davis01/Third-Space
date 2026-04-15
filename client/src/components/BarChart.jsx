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

function BarChart() {
  const data = {
    labels: ["Board Games", "Running", "Film", "Reading", "Hiking"],
    datasets: [
      {
        label: "Number of people interested",
        data: [62, 51, 43,33, 21],
        backgroundColor: "rgba(235, 54, 54, 0.6)"
      }
    ]
  };

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
        text: "Top Interests"
      }
    }
  };

  return (
  <div style={{ height: 400, width: 780 }}>
    <Bar data={data} options={options} />
  </div>
);
}

export default BarChart;