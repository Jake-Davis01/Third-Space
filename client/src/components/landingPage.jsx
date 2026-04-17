import { useEffect, useState } from "react";
import "../css/landingPage.css";
import { useNavigate } from "react-router-dom";

function LandingPage({ setIsEO, setName, setUserEventEmail }) {
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const [canLogin, setCanLogin] = useState(false);

    // runs when "canLogin" is updated. Should happen when its confirmed user has an account
    useEffect(() => {
        if (canLogin) {
            navigate("/home");
        }
    }, [canLogin]);


    async function checkDetails() {
        //call the database to see if user acount exists
        const userAccountDetails = await fetch(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword,
                }),
            },
        );
        //turn the response into a js object
        const data = await userAccountDetails.json();
        //console.log(data);
        //check if an event organiser is trying to login
        if (data.jobRole === "admin") {
            setIsEO(true);
        }
        if (data.jobRole === "employee") {
            setIsEO(false);
        }
        //if the user exits, let them login
        if (data.error !== "Unable to locate user.") {
            localStorage.setItem("userEmail", data.email)
            setCanLogin(true);
            setName(data.firstName)
            setUserEventEmail(data.email)
        }
    }
    //navigate to the signup
    function signUp() {
        navigate("/signup");
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
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="password"
                        className="landingPage-input"
                        onChange={(e) => setUserPassword(e.target.value)}
                    />
                    <br />
                    <button className="loginBtn" onClick={checkDetails}>
                        Login
                    </button>
                    <p className="signupText">
                        Need an account?{" "}
                        <span className="signUpBtn" onClick={signUp}>
                            Sign Up
                        </span>
                    </p>
                </div>
            </div>
            <div className="picture-side"></div>
        </div>
    );
}

export default LandingPage;
