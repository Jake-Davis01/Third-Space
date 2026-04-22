import "../css/home.css";
import { useEffect, useState } from "react";

function Home({ name, userEventEmail }) {
    const totalStars = 5;

    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [pastEventTitle, setPastEventTitle] = useState();
    const [pastEventID, setPastEventID] = useState();

    const [eventName, setEventName] = useState();
    const [eventLocation, setEventLocation] = useState();
    const [eventDate, setEventDate] = useState();
    const [eventDescription, setEventDescription] = useState();
    const [registrationID, setRegistrationID] = useState();

    const [refresh, setRefresh] = useState(0);

    const [upcomingEventName, setUpcomingEventName] = useState();
    const [upcomingEventLocation, setUpcomingEventLocation] = useState();
    const [upcomingEventDate, setUpcomingEventDate] = useState();
    const [upcomingEventDescription, setUpcomingEventDescription] = useState();

    const extractEventTime = (description = "") => { // added: pull saved time out of description text
        const match = description.match(/Event time:\s*([0-2]\d:[0-5]\d)/i);
        return match ? match[1] : "";
    };

    const formatTimeLabel = (timeValue) => { // added: convert 24-hour time into friendly display format
        if (!timeValue) return "";

        const [hourString, minuteString] = timeValue.split(":");
        const hour = Number(hourString);
        const minute = Number(minuteString);

        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;

        return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
    };

    const cleanEventDescription = (description = "") => { // added: remove the embedded time line from the details text
        return description.replace(/\n?\s*Event time:\s*[0-2]\d:[0-5]\d\s*/i, "").trim();
    };

    // Load past event
    useEffect(() => {
        async function getPastEvent() {
            const pastEvent = await fetch(
                `http://localhost:3000/api/home/pastEvent/${userEventEmail}`, // changed: use the same local backend as Aisuggestions.jsx
            );
            const data = await pastEvent.json();
            setPastEventTitle(data.title || data);
            setPastEventID(data.event_id);
        }

        if (userEventEmail) {
            getPastEvent();
        }
    }, [userEventEmail]);

    // Load new + upcoming events
    useEffect(() => {
        async function loadData() {
            try {
                await Promise.all([newEvent(), nextEvent()]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        async function newEvent() {
            const res = await fetch(
                `http://localhost:3000/api/home/newEvent/${userEventEmail}`, // changed: use the same local backend as Aisuggestions.jsx
            );
            const data = await res.json();

            if (data !== "No New Events!") {
                setEventName(data.title);
                setEventLocation(data.location);
                setEventDate(data.event_date);
                setEventDescription(data.description);
                setRegistrationID(data.registration_id);
            } else {
                setEventName(data);
                setRegistrationID(null); // changed: clear stale event id if no new event exists
            }
        }

        async function nextEvent() {
            const res = await fetch(
                `http://localhost:3000/api/home/nextEvent/${userEventEmail}`, // changed: use the same local backend as Aisuggestions.jsx
            );
            const data = await res.json();

            if (data !== "No Upcoming Events!") {
                setUpcomingEventName(data.title);
                setUpcomingEventLocation(data.location);
                setUpcomingEventDate(data.event_date);
                setUpcomingEventDescription(data.description);
            } else {
                setUpcomingEventName(data);
            }
        }

        if (userEventEmail) {
            setLoading(true);
            loadData();
        }
    }, [userEventEmail, refresh]);

    async function sendFeedback(starValue) {
        setRating(starValue);

        const updateReview = await fetch(
            `http://localhost:3000/api/home/pastEvent/`, // changed: use the same local backend as Aisuggestions.jsx
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventID: pastEventID,
                    email: userEventEmail,
                    rating: starValue,
                }),
            },
        );

        const data = await updateReview.json();
        console.log(data);
    }

    async function joinEvent() {
        const updateAttendance = await fetch(
            `http://localhost:3000/api/home/newEvent/${registrationID}`, // changed: use the same local backend as Aisuggestions.jsx
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEventEmail,
                }),
            },
        ); // changed: send the user's email because joining now creates a new registration row

        console.log(updateAttendance);
        setRefresh((prev) => prev + 1);
    }

    const eventTime = formatTimeLabel(extractEventTime(eventDescription)); // added: display-ready time for new event card
    const upcomingEventTime = formatTimeLabel(extractEventTime(upcomingEventDescription)); // added: display-ready time for upcoming event card

    // 🔵 LOADER UI
    if (loading) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
                <h2>Page Loading...</h2>
            </div>
        );
    }

    return (
        <section>
            <div className="welcome-user container">
                <h1>Welcome Back {name}</h1>
            </div>

            <div className="container">
                <h2>New For You</h2>

                {eventName !== "No New Events!" ? (
                    <div className="inner-container">
                        <h1>{eventName}</h1>
                        <p className="date">
                            Date: {eventDate} {eventTime ? `-- Time: ${eventTime} ` : ""}-- Location: {eventLocation} {/* added: show event time when available */}
                        </p>
                        <p className="details">Details</p>
                        <p>{cleanEventDescription(eventDescription)}</p> {/* added: hide the raw embedded time line from details */}
                        <button className="join-button" onClick={joinEvent}>
                            Join
                        </button>
                    </div>
                ) : (
                    <h1>{eventName}</h1>
                )}
            </div>

            <div className="container">
                <h2>Upcoming Events</h2>

                {upcomingEventName !== "No Upcoming Events!" ? (
                    <div className="inner-container">
                        <h1>{upcomingEventName}</h1>
                        <p className="date">
                            Date: {upcomingEventDate} {upcomingEventTime ? `-- Time: ${upcomingEventTime} ` : ""}-- Location: {upcomingEventLocation} {/* added: show event time when available */}
                        </p>
                        <p className="details">Details</p>
                        <p>{cleanEventDescription(upcomingEventDescription)}</p> {/* added: hide the raw embedded time line from details */}
                    </div>
                ) : (
                    <h1>{upcomingEventName}</h1>
                )}
            </div>

            <div className="container">
                <h2>Feedback</h2>
                <h1 className="pastEventHeading">{pastEventTitle}</h1>

                {pastEventTitle !== "No Past Events To Review!" ? (
                    <div className="star-rating">
                        {[...Array(totalStars)].map((_, index) => {
                            let starValue = index + 1;
                            const isActive = starValue <= (hover || rating);

                            return (
                                <span
                                    key={index}
                                    className={`star ${isActive ? "active" : ""}`}
                                    onClick={() => sendFeedback(starValue)}
                                    onMouseEnter={() => setHover(starValue)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    ★
                                </span>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </section>
    );
}

export default Home;
