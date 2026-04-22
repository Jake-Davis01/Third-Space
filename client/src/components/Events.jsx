import "../css/events.css";
import { useState, useEffect } from "react";

function Events({ userEventEmail }) {
    const [events, setEvents] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

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

    function confirmLeave() {
        if (selectedEventId) {
            leaveEvent(selectedEventId);
        }
        setShowConfirm(false);
        setSelectedEventId(null);
    }

    function cancelLeave() {
        setShowConfirm(false);
        setSelectedEventId(null);
    }

    useEffect(() => {
        fetchEvents().then((data) => setEvents(data));
    }, [userEventEmail]);

    return (
        <div className="middlesec">
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
                                onClick={() => {
                                    setSelectedEventId(event.id);
                                    setShowConfirm(true);
                                }}
                            >
                                Leave Group
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Leave Group?</h2>
                        <p>Are you sure you want to leave this event?</p>

                        <div className="modal-actions">
                            <button
                                className="join-button"
                                onClick={confirmLeave}
                            >
                                Yes, Leave
                            </button>
                            <button
                                className="cancel-button"
                                onClick={cancelLeave}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
        </div>
    );
}

export default Events;