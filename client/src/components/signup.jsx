import { useState } from "react";
import "../css/signup.css";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);

    const toggle = (interest) => {
        if (selected.includes(interest)) {
            setSelected(selected.filter((i) => i !== interest));
        } else if (selected.length < 5) {
            setSelected([...selected, interest]);
        }
    };

    function toHome() {
        navigate("/home");
    }

    function toLandingPage() {
        navigate("/");
    }

    return (
        <section className="signup-section">
            <div className="signup-left">
                <h1>Create Your Profile</h1>

                <div className="signup-block">
                    <h2>Your Details</h2>
                    <div className="signup-row">
                        <input
                            type="text"
                            placeholder="First name"
                            className="signup-input"
                        />
                        <input
                            type="text"
                            placeholder="Last name"
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-row">
                        <input
                            type="email"
                            placeholder="Email"
                            className="signup-input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="signup-input"
                        />
                    </div>
                    <select className="signup-input">
                        <option value="">Select office location</option>
                        <option>London — Location</option>
                        <option>Manchester — Location</option>
                        <option>Birmingham — Location</option>
                        <option>Edinburgh — Location</option>
                        <option>Fully remote</option>
                    </select>
                </div>

                <div className="signup-block">
                    <div className="signup-split-row">
                        <div>
                            <h2>Meetup Preference</h2>
                            <div className="signup-inner">
                                <label className="signup-radio">
                                    <input type="radio" name="meetup" /> Online
                                    only
                                </label>
                                <label className="signup-radio">
                                    <input type="radio" name="meetup" /> In
                                    person only
                                </label>
                                <label className="signup-radio">
                                    <input
                                        type="radio"
                                        name="meetup"
                                        defaultChecked
                                    />{" "}
                                    Either — I'm flexible
                                </label>
                            </div>
                        </div>

                        <div>
                            <h2>Your Interests</h2>
                            <p className="signup-hint">
                                Pick 3 to 5 — {selected.length} of 5 selected
                            </p>
                            <div className="signup-inner">
                                <div className="signup-interests">
                                    {[
                                        "Running",
                                        "Film",
                                        "Gaming",
                                        "Cooking",
                                        "Board games",
                                        "Hiking",
                                        "Photography",
                                        "Reading",
                                        "Yoga",
                                        "Cycling",
                                        "Music",
                                        "Travel",
                                        "Chess",
                                        "Volunteering",
                                    ].map((interest) => (
                                        <button
                                            key={interest}
                                            className={`signup-tag ${selected.includes(interest) ? "signup-tag-selected" : ""}`}
                                            onClick={() => toggle(interest)}
                                            disabled={
                                                !selected.includes(interest) &&
                                                selected.length >= 5
                                            }
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="signup-btn" onClick={toHome}>
                    Create account
                </button>
                <p className="signinText">
                    Already have an Account?{" "}
                    <span className="signUpBtn" onClick={toLandingPage}>
                        {" "}
                        Sign In
                    </span>
                </p>
            </div>

            <div className="signup-right"></div>
        </section>
    );
}

export default SignUp;
