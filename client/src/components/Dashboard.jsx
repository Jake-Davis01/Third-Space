import BarChart from "./BarChart";
import LineChart from "./LineChart";
import "../css/Dashboard.css";
import { useEffect, useState } from "react";

const COLORS = [
  "#9333ea", "#0B0033", "#c084fc", "#6b21a8",
  "#7c3aed", "#4c1d95", "#a855f7", "#8b5cf6",
];

function randomColors(count) {
  return Array.from({ length: count }, (_, i) => COLORS[i % COLORS.length]);
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/dashboard")
      .then((res) => res.json())
      .then((data) => setDashboard(data))
      .catch((err) => console.error("Dashboard fetch failed:", err));
  }, []);

  const interestsData = {
    labels: dashboard?.interests?.map((i) => i.name) || [],
    datasets: [
      {
        label: "Number of Employees interested",
        data: dashboard?.interests?.map((i) => Number(i.count)) || [],
        backgroundColor: randomColors(dashboard?.interests?.length || 8),
      },
    ],
  };

  const attendanceData = dashboard && {
    labels: dashboard.attendance.map((i) => i.name),
    datasets: [
      {
        label: "Attendance",
        data: dashboard.attendance.map((i) => Number(i.count)),
        backgroundColor: randomColors(dashboard.attendance.length),
      },
    ],
  };

  const ratingData = dashboard && {
    labels: dashboard.ratings.map((i) => i.name),
    datasets: [
      {
        label: "Average Rating",
        data: dashboard.ratings.map((i) => Number(i.avg_rating)),
        backgroundColor: randomColors(dashboard.ratings.length),
      },
    ],
  };

  console.log("dashboard:", dashboard);
  console.log("interestsData:", interestsData);

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <div className="title">
          <h1>Dashboard Menu</h1>
        </div>

        <div className="box-container">
          <div className="box">
            <h3>Active Users</h3>
            <h1>{dashboard?.activeUsers}</h1>
          </div>
          <div className="box">
            <h3>Registration %</h3>
            <h1>{dashboard?.registrationPercent}%</h1>
          </div>
        </div>

        <div >
          {dashboard && <BarChart data={interestsData} title="Top Interests" />}
        </div>

        <div className="event-history">
        <h2 className="section-title">Past Events</h2>

        <div className="event-item">
          <h3 className="event-title">Sports Day</h3>
          <div className="event-stats">
            <span>⭐ 4.0</span>
            <span>👥 80</span>
            <span>📅 15/04/26</span>
          </div>
        </div>

        <div className="event-item">
          <h3 className="event-title">Bowling Day</h3>
          <div className="event-stats">
            <span>⭐ 4.5</span>
            <span>👥 70</span>
            <span>📅 21/03/26</span>
          </div>
        </div>

        <div className="event-item">
          <h3 className="event-title">Chess Day</h3>
          <div className="event-stats">
            <span>⭐ 4.8</span>
            <span>👥 59</span>
            <span>📅 01/01/26</span>
          </div>
        </div>
      </div>

        <p className="dashboard-section-title">Further Breakdown</p>
        <div className="line-chart-container">
          <LineChart data={dashboard?.userGrowth} />
        </div>

        <div className="box2-container">
          {dashboard && <BarChart data={ratingData} title="Top Activities by Rating" />}
          {dashboard && <BarChart data={attendanceData} title="Top Activities by Attendance" />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;