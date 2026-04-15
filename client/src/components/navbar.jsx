import { Link } from "react-router-dom";
import '../css/navbar.css'


function NavBar() {
    
    return (
        <nav className='navbar'>
            <h1>Third Space</h1>
            <div className="links">
                <Link to="/home">Home</Link>
                <Link to="/">Events</Link>
                <Link to="/">Profile</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/aisuggestions">AI</Link>
                <Link to="/signup">SignUp</Link>
            </div>
        </nav>
    );
}


export default NavBar
