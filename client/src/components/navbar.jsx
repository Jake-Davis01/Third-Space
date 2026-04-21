import { Link } from "react-router-dom";
import '../css/navbar.css'
    

function NavBar({ isEO }) {
    
    return (
        <nav className='navbar'>
            <img src="/third_space_logo.png" alt="Logo" className="navLogo"/>
            <h1>Third Space</h1>
            <div className="links">
                <Link to="/home">Home</Link>
                <Link to="/events">Events</Link>
                <Link to="/profile">Profile</Link>
                {isEO && <Link to="/dashboard">Dashboard</Link>}
                {isEO && <Link to="/aisuggestions">AI</Link>}
                {isEO && <Link to="/eventHub">Events Hub</Link>}

                <Link to="/">Logout</Link>
            </div>
        </nav>
    );
}


export default NavBar
