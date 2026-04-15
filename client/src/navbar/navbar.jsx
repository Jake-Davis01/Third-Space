import { Link } from "react-router-dom";
import './navbar.css'


export function NavBar() {
    
    return (
        <nav className='navbar'>
            <h1>Third Space</h1>
            <div className="links">
                <Link to="/home">Home</Link>
                <Link to="/">Events</Link>
                <Link to="/">Profile</Link>
                <Link to="/">Dashboard</Link>
            </div>
        </nav>
    );
}
