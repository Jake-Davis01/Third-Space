// import { Link } from "react-router-dom";
import './navbar.css'


export function NavBar() {
    
    return (
        <nav className='navbar'>
            <h1>Third Space</h1>
            <div className="links">
                {/* <Link to="/">Home</Link>
                <Link to="/">Events</Link>
                <Link to="/">Profile</Link> */}
                <a href="/">Home</a>
                <a href="/">Events</a>
                <a href="/">Profile</a>
            </div>
        </nav>
    );
}
