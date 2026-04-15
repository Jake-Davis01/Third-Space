import { useEffect, useState } from "react";
import "../css/landingPage.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const [canLogin, setCanLogin] = useState(false);

    // runs when "canLogin". Should happen when its confirmed user has an account
    useEffect(() => {
        if (canLogin) {
            //for testing, will need to be removed in real version
            console.log(userEmail, userPassword);
            navigate("/home");
        }
    }, [canLogin]);

    //will need to be updated to check for user account in database
    function checkDetails() {
        setCanLogin(true);
    }

    function signUp() {
        navigate("/signup")
    }

    return (
        <div className="landingPage">
            <div className="login-side">
                <h1>Welcome To Third Space</h1>
                <div className="login-info">
                    <input
                        type="text"
                        placeholder="email"
                        className="landingPage-input"
                        onChange={(e) => setUserPassword(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="password"
                        className="landingPage-input"
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <br />
                    <button onClick={checkDetails}>Login</button>
                    <p>
                        Need an account? <span className="signUpBtn" onClick={signUp}>Sign Up</span>
                    </p>
                </div>
            </div>
            <div className="picture-side"></div>
        </div>
    );
}

export default LandingPage;
