import "../css/eventsHub.css";
import { useState, useEffect } from "react";

const BASE = "https://third-space-backend-sjay.onrender.com/api";

function EditModal({ event, onClose, onSave }) {
    const [form, setForm] = useState({
        title: event.title || "",
        description: event.description || "",
        event_date: event.event_date ? event.event_date.slice(0, 10) : "",
        location: event.location || "",    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit() {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`${BASE}/events/${event.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to update");
            const updated = await res.json();
            setSaved(true);
            setTimeout(() => onSave(updated), 800);
        } catch (err) {
            setError("Could not save changes. Please try again.");
            setSaving(false);
        }
    }

    function handleBackdrop(e) {
        if (e.target === e.currentTarget) onClose();
    }

    return (
        <div className="modal-backdrop" onClick={handleBackdrop}>
            <div className="modal">
                <div className="modal-header">
                    <h2>Edit Event</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <label>Title</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Event title" />

                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Event description" rows={4} />

                    <label>Date</label>
                    <input type="date" name="event_date" value={form.event_date} onChange={handleChange} />

                    <label>Location</label>
                    <select name="location" value={form.location} onChange={handleChange}>
                        <option value="">Select office location</option>
                        <option value="London">London</option>
                        <option value="Manchester">Manchester</option>
                        <option value="Birmingham">Birmingham</option>
                        <option value="Edinburgh">Edinburgh</option>
                        <option value="Fully remote">Fully remote</option>
                    </select>

                    {error && <p className="error">{error}</p>}
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} disabled={saving}>Cancel</button>
                    <button onClick={handleSubmit} disabled={saving}>
                        {saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function EventHub() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editTarget, setEditTarget] = useState(null);
    const [confirmId, setConfirmId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetch(`${BASE}/events`)
            .then((r) => r.json())
            .then((data) => { setEvents(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [loading, editTarget]);

    async function handleDelete(id) {
        setDeletingId(id);
        try {
            const res = await fetch(`${BASE}/events/${id}`, { method: "DELETE" });
            if (res.ok) setEvents((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            console.error("Error deleting event:", err);
        } finally {
            setDeletingId(null);
            setConfirmId(null);
        }
    }

    function handleSave(updated) {
        setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        setEditTarget(null);
    }


    if (loading) return <p>Loading events…</p>;

    return (
        <section>
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
                                Date: {event.event_date} -- Location: {event.location}
                            </p>

                            <div className="events-actions">
                                {confirmId === event.id ? (
                                    <>
                                        <span>Are you sure?</span>
                                        <button
                                            className="join-button"
                                            onClick={() => handleDelete(event.id)}
                                            disabled={deletingId === event.id}
                                        >
                                            {deletingId === event.id ? "Deleting…" : "Yes, delete"}
                                        </button>
                                        <button className="join-button" onClick={() => setConfirmId(null)}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="join-button" onClick={() => setEditTarget(event)}>
                                            Edit
                                        </button>
                                        <button className="join-button" onClick={() => setConfirmId(event.id)}>
                                            Delete Event
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}

            {editTarget && (
                <EditModal
                    event={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={handleSave}
                />
            )}
        </section>
    );
}

export default EventHub;