import "../css/events.css";
import { useState, useEffect } from "react";

function Events({ userEventEmail }) {
    const [events, setEvents] = useState([]);

    async function fetchEvents() {
        const res = await fetch(
            `http://localhost:3000/api/eventPage/userEvents/${userEventEmail}`,
        );
        const data = await res.json();
        return data;
    }

    async function leaveEvent(eventID) {
        try {
            const res = await fetch(
                "http://localhost:3000/api/eventPage/userEvents/",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        eventID: eventID,
                        email: userEventEmail,
                    }),
                },
            );

            const updated = await res.json();
            console.log("Updated:", updated);

            // remove event from UI after successful cancel
            setEvents((prev) => prev.filter((event) => event.id !== eventID));
        } catch (err) {
            console.error("Error leaving event:", err);
        }
    }

    useEffect(() => {
        fetchEvents().then((data) => setEvents(data));
    }, [userEventEmail]);

    return (
        <section>
            <div className="welcome-user container">
                <h1>Your Events</h1>
            </div>

            {events.length === 0 ? (
                <div className="events-container">
                    <h1>No upcoming events</h1>
                </div>
            ) : (
                events.map((event) => (
                    <div key={event.id} className="events-container">
                        <h1>{event.title}</h1>

                        <div className="events-footer">
                            <p className="date">
                                Date: {event.event_date} -- Location:{" "}
                                {event.location}
                            </p>

                            <button
                                className="join-button"
                                onClick={() => leaveEvent(event.id)}
                            >
                                Leave Group
                            </button>
                        </div>
                    </div>
                ))
            )}
        </section>
    );
}

export default Events;
