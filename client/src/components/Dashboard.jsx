import BarChart from "./BarChart";
import LineChart from "./LineChart";
import '../css/Dashboard.css'
import { useEffect, useState } from "react";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
    fetch("http://localhost:3000/api/dashboard")
        .then(res => res.json())
        .then(data => setDashboard(data))
        .catch(err => console.error("Dashboard fetch failed:", err));
    }, []);

    const interestsData = {
    labels: dashboard?.interests?.map(i => i.name) || [],
    datasets: [{
        label: "Number of Employees interested",
        data: dashboard?.interests?.map(i => Number(i.count)) || [],
        backgroundColor: "rgba(235, 54, 54, 0.6)"
    }]
    };

    const attendanceData = dashboard && {
    labels: dashboard.attendance.map(i => i.name),
    datasets: [{
        label: "Attendance",
        data: dashboard.attendance.map(i => Number(i.count)),
        backgroundColor: "rgba(54, 162, 235, 0.6)"
    }]
    };

    const ratingData = dashboard && {
    labels: dashboard.ratings.map(i => i.name),
    datasets: [{
        label: "Average Rating",
        data: dashboard.ratings.map(i => Number(i.avg_rating)),
        backgroundColor: "rgba(54, 162, 235, 0.6)"
    }]
    };


    console.log("dashboard:", dashboard);
    console.log("interestsData:", interestsData);

    return (
        <div className="dashboard-page">
        <div className="dashboard">
            
            <div className="title"><h1>Dashboard Menu</h1></div>

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

            <div className="chart-container">
            {dashboard && <BarChart data={interestsData} title="Top Interests" />} </div>
            

            <div className="pastevents-box">
                <h2> Past Events</h2>
                <div className="chartbox">Sports Day Avg Score 4.0 Attended 80 Date 15/04/26</div>
                <div className="chartbox">Bowling Day Avg Score 4.5 Attended 70 Date 21/03/26</div>
                <div className="chartbox">Chess Day Avg Score 4.8 Attended 59 Date 01/01/26</div>
            </div>

            

            <h2>Further Breakdown</h2>
            <LineChart data={dashboard?.userGrowth} />
            <div className="box2-container">
            {dashboard && <BarChart data={ratingData} title="Top Activities by Rating" />}
            {dashboard && <BarChart data={attendanceData} title="Top Activities by Attendance" />}
            </div>
            


        </div></div>
    );
}

export default Dashboard;