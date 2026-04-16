import '../css/events.css'

import { useState, useEffect } from "react";

const fakeExampleObj = [
    {
        userID: 1,
        eventName: "Board Games",
        date: "21/03/2026",
        time: "6pm",
        location: "London Office",
    },
    {
        userID: 1,
        eventName: "Lunch Quiz",
        date: "30/04/2026",
        time: "12pm",
        location: "Online",
    },
    {
        userID: 1,
        eventName: "Lunch Quiz 45",
        date: "30/04/2026",
        time: "12pm",
        location: "Online",
    },
];

// Replace this with a real database/API call later e.g:
async function fetchEvents() {
    // const response = await fetch("/api/events");
    // return await response.json();
    return fakeExampleObj;
}

function Events() {
    const [events, setEvents] = useState([]);

    //on page load it gets the events data
    useEffect(() => {
        fetchEvents().then((data) => setEvents(data));
    }, []);

    //will need to be changed to have a patch request that updates the groups the employee is a part of
    const handleLeaveGroup = (index) => {
        setEvents(events.filter((_, i) => i !== index));
    };

    return (
        <section>
            <div className="welcome-user container">
                <h1>Your Events</h1>
            </div>
            {events.map((event, index) => (
                <div key={index} className="events-container">
                    <h1>{event.eventName}</h1>
                    <div className="events-footer">
                        <p className="date">
                            Date: {event.date} at {event.time} -- Location: {event.location}
                        </p>
                        <button
                            className="join-button"
                            onClick={() => handleLeaveGroup(index)}
                        >
                            Leave Group
                        </button>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default Events;