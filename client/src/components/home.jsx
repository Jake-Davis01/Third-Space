import "../css/home.css";

import { useEffect, useState } from "react";

function Home({ name, userEventEmail }) {
    const totalStars = 5;

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const [eventName, setEventName] = useState();
    const [eventLocation, setEventLocation] = useState();
    const [eventDate, setEventDate] = useState();
    const [eventDescription, setEventDescription] = useState();
    const [registrationID, setRegistrationID] = useState();

    const [refresh, setRefresh] = useState(0);

    //console.log(userID);
    //effect called when page loads, updates any new events for the user
    useEffect(() => {
        async function newEvent() {
            //console.log(userEventEmail);
            const newEventDetails = await fetch(
                `http://localhost:3000/api/home/newEvent/${userEventEmail}`,
            );
            const data = await newEventDetails.json();
            console.log(data);
            if (data !== "No New Events!") {
                setEventName(data.title);
                setEventLocation(data.location);
                const formattedDate = new Date(
                    data.event_date,
                ).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                });
                setEventDate(formattedDate);
                setEventDescription(data.description);
                setRegistrationID(data.registration_id);
            } else {
                setEventName(data);
            }
        }
        newEvent();
    }, [userEventEmail, refresh]);

    async function joinEvent() {
        const updateAttendance = await fetch(
            `http://localhost:3000/api/home/newEvent/${registrationID}`,
            {
                method: "POST",
            },
        );
        console.log(updateAttendance);
        setRefresh((prev) => prev + 1);
    }

    return (
        <section>
            <div className="welcome-user container">
                <h1>Welcome Back {name}</h1>
                <p>3 Events this month</p>
            </div>

            <div className="container">
                <h2>New For You</h2>

                {eventName !== "No New Events!" ? (
                    <div className="inner-container">
                        <h1>{eventName}</h1>
                        <p className="date">
                            Date: {eventDate} -- Location: {eventLocation}
                        </p>
                        <p className="details">Details</p>
                        <p>{eventDescription}</p>
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
                <div className="inner-container">
                    <h1>Event Name</h1>
                    <p className="date">Date: 12/05/2026 -- Location: Online</p>
                    <p className="details">Details</p>
                </div>
            </div>

            <div className="container">
                <h2>Last Event - Feedback</h2>
                <div className="inner-container">
                    <div className="star-rating">
                        {[...Array(totalStars)].map((_, index) => {
                            const starValue = index + 1;

                            const isActive = starValue <= (hover || rating);

                            return (
                                <span
                                    key={index}
                                    className={`star ${isActive ? "active" : ""}`}
                                    onClick={() => setRating(starValue)}
                                    onMouseEnter={() => setHover(starValue)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    ★
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;
