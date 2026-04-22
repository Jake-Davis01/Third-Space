import { useState } from "react";
import "../css/signup.css";
import { useNavigate } from "react-router-dom";

const INTERESTS = [
    "Running", "Film", "Gaming", "Cooking",
    "Board games", "Hiking", "Photography", "Reading",
    "Yoga", "Cycling", "Music", "Travel",
    "Chess", "Volunteering",
]

function SignUp() {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [meetupPreference, setMeetupPreference] = useState("either");
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        office_location: "",
    });
    const [error, setError] = useState("");

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter((i) => i !== interest));
        } else if (selectedInterests.length < 5) {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!formData.first_name.trim()) return "First name is required."
        if (!formData.last_name.trim()) return "Last name is required."
        if (!formData.email.includes("@") || !formData.email.includes(".")) return "Please enter a valid email address."
        if (formData.password.length < 8) return "Password must be at least 8 characters."
        if (!formData.office_location) return "Please select an office location."
        if (selectedInterests.length < 3) return "Please select at least 3 interests."
        return null
    }

    const handleSubmit = async () => {
        setError("");

        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    user_interests: selectedInterests,
                    meetup_preference: meetupPreference,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Registration failed");

            localStorage.setItem("userEmail", formData.email);
            navigate("/");
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
                            placeholder="Password (min 8 characters)"
                            className="signup-input"
                            onChange={handleChange}
                        />
                    </div>
                    <select
                        name="office_location"
                        className="signup-input"
                        onChange={handleChange}
                    >
                        <option value="">Select office location</option>
                        <option value="london">London</option>
                        <option value="manchester">Manchester</option>
                        <option value="birmingham">Birmingham</option>
                        <option value="edinburgh">Edinburgh </option>
                        <option value="remote">Fully remote</option>
                    </select>
                </div>

                <div className="signup-block">
                    <div className="signup-split-row">
                        <div>
                            <h2>Meetup Preference</h2>
                            <div className="signup-inner">
                                <label className="signup-radio">
                                    <input type="radio" name="meetup" value="online" onChange={(e) => setMeetupPreference(e.target.value)} /> Online only
                                </label>
                                <label className="signup-radio">
                                    <input type="radio" name="meetup" value="in_person" onChange={(e) => setMeetupPreference(e.target.value)} /> In person only
                                </label>
                                <label className="signup-radio">
                                    <input type="radio" name="meetup" value="either" defaultChecked onChange={(e) => setMeetupPreference(e.target.value)} /> Either — I'm flexible
                                </label>
                            </div>
                        </div>

                        <div>
                            <h2>Your Interests</h2>
                            <p className="signup-hint">
                                Pick 3 to 5 — {selectedInterests.length} of 5 selected
                            </p>
                            <div className="signup-inner">
                                <div className="signup-interests">
                                    {INTERESTS.map((interest) => (
                                        <button
                                            key={interest}
                                            className={`signup-tag ${selectedInterests.includes(interest) ? "signup-tag-selected" : ""}`}
                                            onClick={() => toggleInterest(interest)}
                                            disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5}
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

            <div className="signup-right">
                <img src="/third_space_logoo.gif" alt="Logo" className="signupLogo" /> {/* added logo */}
                <p className="signupSlogan">Insights that find their place</p> {/* added slogan */}
            </div>
        </section>
    );
}

export default SignUp;
