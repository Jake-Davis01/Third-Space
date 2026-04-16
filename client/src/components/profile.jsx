import { useState } from "react"
import '../css/profile.css'

function Profile() {
    const [selected, setSelected] = useState(["Running", "Film"])
    const [location, setLocation] = useState("London — Location")
    const [meetup, setMeetup] = useState("flexible")
    const [saved, setSaved] = useState(false)

    const toggle = (interest) => {
        if (selected.includes(interest)) {
            setSelected(selected.filter((i) => i !== interest))
        } else if (selected.length < 5) {
            setSelected([...selected, interest])
        }
    }

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

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
                    <option>London — Location</option>
                    <option>Manchester — Location</option>
                    <option>Birmingham — Location</option>
                    <option>Edinburgh — Location</option>
                    <option>Fully remote</option>
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
                                    value="inperson"
                                    checked={meetup === "inperson"}
                                    onChange={() => setMeetup("inperson")}
                                /> In person only
                            </label>
                            <label className="profile-radio">
                                <input
                                    type="radio"
                                    name="meetup"
                                    value="flexible"
                                    checked={meetup === "flexible"}
                                    onChange={() => setMeetup("flexible")}
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
                                {["Running", "Film", "Gaming", "Cooking", "Board games", "Hiking", "Photography", "Reading", "Yoga", "Cycling", "Music", "Travel", "Chess", "Volunteering"].map((interest) => (
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