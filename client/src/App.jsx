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


// Layout component that includes the NavBar
    const WithNav = ({ isEO }) => (
        <>
            <NavBar isEO={isEO} />
            <Outlet />
        </>
    );

function App() {
    //for the event organiser. If the person logging is is an EO, this will be updated to true
    const [isEO, setIsEO] = useState(false);
    const [name, setName] = useState()

    return (
        <Router>
            <Routes>
                {/* Landing page and signup — no NavBar */}
                <Route path="/" element={<LandingPage setIsEO={setIsEO} setName={setName}/>} />
                <Route path="/signup" element={<SignUp />} />

                {/* All other pages — wrapped with NavBar */}
                <Route element={<WithNav isEO={isEO} />}>
                    <Route path="/home" element={<Home name={name} />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/aisuggestions" element={<Aisuggestions />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
