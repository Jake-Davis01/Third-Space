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

    // thank you for feedback popup state
    const [showThankYou, setShowThankYou] = useState(false);

    const extractEventTime = (description = "") => {
        const match = description.match(/Event time:\s*([0-2]\d:[0-5]\d)/i);
        return match ? match[1] : "";
    };

    const formatTimeLabel = (timeValue) => {
        if (!timeValue) return "";

        const [hourString, minuteString] = timeValue.split(":");
        const hour = Number(hourString);
        const minute = Number(minuteString);

        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;

        return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
    };

    const cleanEventDescription = (description = "") => {
        return description.replace(/\n?\s*Event time:\s*[0-2]\d:[0-5]\d\s*/i, "").trim();
    };

    // Load past event
    useEffect(() => {
        async function getPastEvent() {
            const pastEvent = await fetch(
                `https://third-space-backend-sjay.onrender.com/api/home/pastEvent/${userEventEmail}`,
            );
            const data = await pastEvent.json();
            setPastEventTitle(data.title || data);
            setPastEventID(data.event_id);
        }

        if (userEventEmail) {
            getPastEvent();
        }
    }, [userEventEmail, refresh]); // ✅ include refresh so it clears after feedback

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
                `https://third-space-backend-sjay.onrender.com/api/home/newEvent/${userEventEmail}`,
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
                setRegistrationID(null);
            }
        }

        async function nextEvent() {
            const res = await fetch(
                `https://third-space-backend-sjay.onrender.com/api/home/nextEvent/${userEventEmail}`,
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
            `https://third-space-backend-sjay.onrender.com/api/home/pastEvent/`,
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

        // show popup
        setShowThankYou(true);
    }

    // close popup + refresh
    function closeThankYou() {
        setShowThankYou(false);
        setRefresh((prev) => prev + 1);
        setRating(0);
    }

    async function joinEvent() {
        const updateAttendance = await fetch(
            `https://third-space-backend-sjay.onrender.com/api/home/newEvent/${registrationID}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEventEmail,
                }),
            },
        );

        console.log(updateAttendance);
        setRefresh((prev) => prev + 1);
    }

    const eventTime = formatTimeLabel(extractEventTime(eventDescription));
    const upcomingEventTime = formatTimeLabel(extractEventTime(upcomingEventDescription));

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

            {/* NEW EVENTS */}
            <div className="container">
                <h2>New For You</h2>

                {eventName !== "No New Events!" ? (
                    <div className="inner-container">
                        <h1>{eventName}</h1>
                        <p className="date">
                            Date: {eventDate} {eventTime ? `-- Time: ${eventTime} ` : ""}-- Location: {eventLocation}
                        </p>
                        <p className="details">Details</p>
                        <p>{cleanEventDescription(eventDescription)}</p>
                        <button className="join-button" onClick={joinEvent}>
                            Join
                        </button>
                    </div>
                ) : (
                    <h1>{eventName}</h1>
                )}
            </div>

            {/* UPCOMING EVENTS */}
            <div className="container">
                <h2>Upcoming Events</h2>

                {upcomingEventName !== "No Upcoming Events!" ? (
                    <div className="inner-container">
                        <h1>{upcomingEventName}</h1>
                        <p className="date">
                            Date: {upcomingEventDate} {upcomingEventTime ? `-- Time: ${upcomingEventTime} ` : ""}-- Location: {upcomingEventLocation}
                        </p>
                        <p className="details">Details</p>
                        <p>{cleanEventDescription(upcomingEventDescription)}</p>
                    </div>
                ) : (
                    <h1>{upcomingEventName}</h1>
                )}
            </div>

            {/* FEEDBACK */}
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

            {/* THANK FOR FEEDBACK YOU MODAL */}
            {showThankYou && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Thank You!</h2>
                        <p>Your feedback has been submitted.</p>

                        <div className="modal-actions center">
                            <button
                                className="join-button"
                                onClick={closeThankYou}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Home;