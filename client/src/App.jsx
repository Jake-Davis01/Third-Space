import "./css/App.css";
import "./css/index.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Outlet,
} from "react-router-dom";
import { useState } from "react";

import NavBar from "./components/navbar";
import Home from "./components/home";
import Dashboard from "./components/Dashboard";
import Aisuggestions from "./components/Aisuggestions";
import SignUp from "./components/signup";
import LandingPage from "./components/landingPage";
import Profile from "./components/profile";
import Events from "./components/Events";
import EventHub from "./components/eventHub";
import Footer from "./components/Footer"; // added: footer so we can link to user guide without cluttering navbar
import UserGuide from "./components/UserGuide"; // added: user guide page for end-user documentation

// Layout component that includes the NavBar
const WithNav = ({ isEO }) => (
    <div className="appContainer"> {/* added wrapper for full height layout */}
        <NavBar isEO={isEO} />
        <div className="pageContent"> {/* added: content area grows so footer stays at bottom */}
            <Outlet />
        </div>
        <Footer /> {/* added: footer appears on all main pages and contains link to user guide */}
    </div>
);

function App() {
    //for the event organiser. If the person logging is is an EO, this will be updated to true
    const [isEO, setIsEO] = useState(false);
    const [name, setName] = useState()
    const [userEventEmail, setUserEventEmail] = useState()

    return (
        <Router>
            <Routes>
                {/* Landing page and signup — no NavBar */}
                <Route path="/" element={<LandingPage setIsEO={setIsEO} setName={setName} setUserEventEmail={setUserEventEmail} />} />
                <Route path="/signup" element={<SignUp />} />

                {/* All other pages — wrapped with NavBar */}
                <Route element={<WithNav isEO={isEO} />}>
                    <Route path="/home" element={<Home name={name} userEventEmail={userEventEmail} />} />
                    <Route path="/events" element={<Events userEventEmail={userEventEmail} />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/aisuggestions" element={<Aisuggestions />} />
                    <Route path="/eventHub" element={<EventHub />} />
                    <Route path="/guide" element={<UserGuide />} /> {/* added: guide now uses navbar and footer too */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;