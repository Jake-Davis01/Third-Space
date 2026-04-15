import BarChart from "./BarChart";
import LineChart from "./LineChart";
import '../css/Dashboard.css'

function Dashboard() {
    return (
        <div className="dashboard">
            
            <h1 className="title">Dashboard Menu</h1>

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
            <BarChart /> </div>
            

            <div className="pastevents-box">
                <h2> Past Events</h2>
                <div className="chartbox">Sports Day Avg Score 4.0 Attended 80 Date 15/04/26</div>
                <div className="chartbox">Bowling Day Avg Score 4.5 Attended 70 Date 21/03/26</div>
                <div className="chartbox">Chess Day Avg Score 4.8 Attended 59 Date 01/01/26</div>
            </div>

            <div className="box2-container">
                <h2>Further Breakdown</h2>
                <LineChart />
            </div>
            


        </div>
    );
}

export default Dashboard;