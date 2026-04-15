import "../css/landingPage.css";

function LandingPage() {
    return (
        <div className="landingPage">
            <div className="login-side">
                <h1>Welcome To Third Space</h1>
                <div className="login-info">
                    <input
                        type="text"
                        placeholder="email"
                        className="landingPage-input"
                    />
                    <br />
                    <input
                        type="text"
                        placeholder="password"
                        className="landingPage-input"
                    />
                    <br />
                    <button>Login</button>
                    <p>
                        Need an account? <span>Sign Up</span>
                    </p>
                </div>
            </div>
            <div className="picture-side"></div>
        </div>
    );
}

export default LandingPage;
