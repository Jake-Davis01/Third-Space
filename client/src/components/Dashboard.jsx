import BarChart from "./BarChart";
import LineChart from "./LineChart";
import '../css/Dashboard.css'

function Dashboard() {
    const interestsData = {
        labels: ["Board Games", "Running", "Film", "Reading", "Hiking"],
        datasets: [
            {
                label: "Number of Emplyoees interested",
                data: [62, 51, 43, 33, 21],
                backgroundColor: "rgba(235, 54, 54, 0.6)"
            }
    ]
    };

    const AttendanceData = {
        labels: ["Running", "Reading", "Birmingham"],
        datasets: [
            {
                label: "Number of Emplyoees",
                data: [20, 15, 3],
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }
        ]
    };

    const RatingData = {
        labels: ["Film", "Running", "Reading"],
        datasets: [
            {
                label: "Number of Emplyoees",
                data: [17, 15, 6],
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }
        ]        

    };

    return (
        <div className="dashboard-page">
        <div className="dashboard">
            
            <div className="title"><h1>Dashboard Menu</h1></div>

            <div className="box-container">
                <div className="box">
                    <h2>Active Users</h2>
                    <p>419</p>
                </div>
                <div className="box">
                    <h2>Registration</h2>
                    <p>67%</p>
                </div>
            </div>

            <div className="chart-container">
            <BarChart data={interestsData} title="Top Interests"/> </div>
            

            <div className="pastevents-box">
                <h2> Past Events</h2>
                <div className="chartbox">Sports Day Avg Score 4.0 Attended 80 Date 15/04/26</div>
                <div className="chartbox">Bowling Day Avg Score 4.5 Attended 70 Date 21/03/26</div>
                <div className="chartbox">Chess Day Avg Score 4.8 Attended 59 Date 01/01/26</div>
            </div>

            

            <h2>Further Breakdown</h2>
            <LineChart />
            <div className="box2-container">
            <BarChart data={RatingData} title="Top Activities by Rating" />
            <BarChart data={AttendanceData} title="Top Activites by Attendance" />
            </div>
            


        </div>
        </div>
    );
}

export default Dashboard;