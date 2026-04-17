import "../css/home.css";

import { useEffect, useState } from "react";

function Home({ name, userEventEmail }) {
    //for star rating
    const totalStars = 5;

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [pastEventTitle, setPastEventTitle] = useState();
    const [pastEventID, setPastEventID] = useState();

    //for showing the most recent past event
    useEffect(() => {
        async function getPastEvent() {
            const pastEvent = await fetch(
                `http://localhost:3000/api/home/pastEvent/${userEventEmail}`,
            );
            const data = await pastEvent.json();
            //console.log(data);
            setPastEventTitle(data.title || data);
            //console.log(`past title is ${pastEventTitle}`);
            setPastEventID(data.event_id);
        }

        if (userEventEmail) {
            getPastEvent();
        }
    }, [userEventEmail]);

    async function sendFeedback(starValue) {
        setRating(starValue);

        const updateReview = await fetch(
            `http://localhost:3000/api/home/pastEvent/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
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

    //for new events to the user
    const [eventName, setEventName] = useState();
    const [eventLocation, setEventLocation] = useState();
    const [eventDate, setEventDate] = useState();
    const [eventDescription, setEventDescription] = useState();
    const [registrationID, setRegistrationID] = useState();
    //for retriggering the fetch request to see what new event is available to the user
    const [refresh, setRefresh] = useState(0);

    //for the users upcoming event
    const [upcomingEventName, setUpcomingEventName] = useState();
    const [upcomingEventLocation, setUpcomingEventLocation] = useState();
    const [upcomingEventDate, setUpcomingEventDate] = useState();
    const [upcomingEventDescription, setUpcomingEventDescription] = useState();

    //console.log(userID);
    //effect called when page loads, updates any new events for the user and their upcoming one
    useEffect(() => {
        async function newEvent() {
            //console.log(userEventEmail);
            //GET request
            const newEventDetails = await fetch(
                `http://localhost:3000/api/home/newEvent/${userEventEmail}`,
            );
            const data = await newEventDetails.json();
            //console.log(data);
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

        async function nextEvent() {
            const nextEventDetails = await fetch(
                `http://localhost:3000/api/home/nextEvent/${userEventEmail}`,
            );
            const nextEventData = await nextEventDetails.json();
            //console.log(nextEventData);
            if (nextEventData !== "No Upcoming Events!") {
                setUpcomingEventName(nextEventData.title);
                setUpcomingEventLocation(nextEventData.location);
                const formattedDate = new Date(
                    nextEventData.event_date,
                ).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                });
                setUpcomingEventDate(formattedDate);
                setUpcomingEventDescription(nextEventData.description);
            } else {
                setUpcomingEventName(nextEventData);
            }
        }
        nextEvent();
        newEvent();
    }, [userEventEmail, refresh]);

    async function joinEvent() {
        //PATCH request
        const updateAttendance = await fetch(
            `http://localhost:3000/api/home/newEvent/${registrationID}`,
            {
                method: "PATCH",
            },
        );
        console.log(updateAttendance);
        setRefresh((prev) => prev + 1);
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

                {upcomingEventName !== "No Upcoming Events!" ? (
                    <div className="inner-container">
                        <h1>{upcomingEventName}</h1>
                        <p className="date">
                            Date: {upcomingEventDate} -- Location:{" "}
                            {upcomingEventLocation}
                        </p>
                        <p className="details">Details</p>
                        <p>{upcomingEventDescription}</p>
                    </div>
                ) : (
                    <h1>{upcomingEventName}</h1>
                )}
            </div>

            <div className="container">
                <h2>Feedback</h2>
                <h1>{pastEventTitle}</h1>

                {pastEventTitle !== "No Past Events!" ? (
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
