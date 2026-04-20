import { useState, useEffect } from "react"
import '../css/profile.css'

const INTERESTS = [
    "Running", "Film", "Gaming", "Cooking",
    "Board games", "Hiking", "Photography", "Reading",
    "Yoga", "Cycling", "Music", "Travel",
    "Chess", "Volunteering",
]

function Profile() {
    const [selected, setSelected] = useState([])
    const [location, setLocation] = useState("")
    const [meetup, setMeetup] = useState("either")
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(true)

    const userEmail = localStorage.getItem("userEmail")

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/auth/profile/${userEmail}`)
                const data = await response.json()

                setLocation(data.officeLocation || "")
                setMeetup(data.meetupPreference || "either")
                setSelected(data.userInterests || [])
            } catch (err) {
                console.error("Failed to load profile:", err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const toggle = (interest) => {
        if (selected.includes(interest)) {
            setSelected(selected.filter((i) => i !== interest))
        } else if (selected.length < 5) {
            setSelected([...selected, interest])
        }
    }

    const handleSave = async () => {
        if (selected.length < 3) {
            alert("Please select at least 3 interests.")
            return
        }

        try {
            const response = await fetch(`http://localhost:3000/api/auth/profile/${userEmail}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    office_location: location,
                    meetup_preference: meetup,
                    user_interests: selected,
                }),
            })

            if (!response.ok) throw new Error("Failed to save")

            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch (err) {
            console.error(err.message)
        }
    }

    if (loading) return <p>Loading profile...</p>

    return (
        <div className="profile-section">

            <h1 className="profile-title">Your Profile</h1>

            <div className="profile-block">
                <h2>Your Details</h2>
                <select
                    className="profile-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">Select office location</option>
                    <option value="london">London</option>
                    <option value="manchester">Manchester</option>
                    <option value="birmingham">Birmingham</option>
                    <option value="edinburgh">Edinburgh</option>
                    <option value="remote">Fully remote</option>
                </select>
            </div>

            <div className="profile-block">
                <div className="profile-split-row">
                    <div>
                        <h2>Meetup Preference</h2>
                        <div className="profile-inner">
                            <label className="profile-radio">
                                <input
                                    type="radio"
                                    name="meetup"
                                    value="online"
                                    checked={meetup === "online"}
                                    onChange={() => setMeetup("online")}
                                /> Online only
                            </label>
                            <label className="profile-radio">
                                <input
                                    type="radio"
                                    name="meetup"
                                    value="in_person"
                                    checked={meetup === "in_person"}
                                    onChange={() => setMeetup("in_person")}
                                /> In person only
                            </label>
                            <label className="profile-radio">
                                <input
                                    type="radio"
                                    name="meetup"
                                    value="either"
                                    checked={meetup === "either"}
                                    onChange={() => setMeetup("either")}
                                /> Either — I'm flexible
                            </label>
                        </div>
                    </div>

                    <div>
                        <h2>Your Interests</h2>
                        <p className="profile-hint">
                            Pick 3 to 5 — {selected.length} of 5 selected
                        </p>
                        <div className="profile-inner">
                            <div className="profile-interests">
                                {INTERESTS.map((interest) => (
                                    <button
                                        key={interest}
                                        className={`profile-tag ${selected.includes(interest) ? "profile-tag-selected" : ""}`}
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

            <button className="profile-btn" onClick={handleSave}>
                {saved ? "Saved!" : "Save changes"}
            </button>

        </div>
    )
}

export default Profile