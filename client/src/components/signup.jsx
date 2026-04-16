import { useState } from "react";
import "../css/signup.css";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    const [meetup, setMeetup] = useState("either");
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const toggle = (interest) => {
        if (selected.includes(interest)) {
            setSelected(selected.filter((i) => i !== interest));
        } else if (selected.length < 5) {
            setSelected([...selected, interest]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError("");

        if (selected.length < 3) {
            setError("Please select at least 3 interests.");
            return;
        }

        try {
                const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    user_interests: selected,
                    meetup_preference: meetup,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Registration failed");

            navigate("/home");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="signup-section">
            <div className="signup-left">
                <h1>Create Your Profile</h1>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className="signup-block">
                    <h2>Your Details</h2>
                    <div className="signup-row">
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First name"
                            className="signup-input"
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last name"
                            className="signup-input"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="signup-row">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="signup-input"
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="signup-input"
                            onChange={handleChange}
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
                                    <input type="radio" name="meetup" value="online" onChange={(e) => setMeetup(e.target.value)} /> Online only
                                </label>
                                <label className="signup-radio">
                                    <input type="radio" name="meetup" value="in_person" onChange={(e) => setMeetup(e.target.value)} /> In person only
                                </label>
                                <label className="signup-radio">
                                    <input type="radio" name="meetup" value="either" defaultChecked onChange={(e) => setMeetup(e.target.value)} /> Either — I'm flexible
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
                                        "Running", "Film", "Gaming", "Cooking",
                                        "Board games", "Hiking", "Photography", "Reading",
                                        "Yoga", "Cycling", "Music", "Travel",
                                        "Chess", "Volunteering",
                                    ].map((interest) => (
                                        <button
                                            key={interest}
                                            className={`signup-tag ${selected.includes(interest) ? "signup-tag-selected" : ""}`}
                                            onClick={() => toggle(interest)}
                                            disabled={!selected.includes(interest) && selected.length >= 5}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="signup-btn" onClick={handleSubmit}>
                    Create account
                </button>
                <p className="signinText">
                    Already have an Account?{" "}
                    <span className="signUpBtn" onClick={() => navigate("/")}> Sign In</span>
                </p>
            </div>

            <div className="signup-right"></div>
        </section>
    );
}

export default SignUp;