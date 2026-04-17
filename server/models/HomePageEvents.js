const db = require("../database/connect");

class HomePageEvents {
    constructor({ id, user_email, event_id, status, registered_at }) {
        ((this.id = id),
            (this.user_email = user_email),
            (this.event_id = event_id),
            (this.status = status),
            (this.registered_at = registered_at));
    }

    static async getNewEvent(user_email) {
        //console.log(`hello ${user_email}`);

        const query = `
        SELECT e.*, er.id AS registration_id
        FROM events e
        JOIN event_registrations er ON e.id = er.event_id
        WHERE er.user_email = $1
        AND er.status = 'unresponsive'
        ORDER BY e.created_at DESC
        LIMIT 1;
        `;

        const result = await db.query(query, [user_email]);

        if (result.rows.length === 0) {
            console.log("No New Events!");
            return "No New Events!";
        }
        console.log(result.rows[0]);
        return result.rows[0]; // latest event
    }

    static async joinEvent(eventRegistrationID) {
        const result = await db.query(
            `UPDATE event_registrations
            SET status = 'registered'
            WHERE id = $1
            RETURNING *`,
            [eventRegistrationID],
        );

        return result.rows[0];
    }

    static async nextEvent(user_email) {
        const query = `
        SELECT 
        er.*, 
        e.title, 
        e.description, 
        e.event_date, 
         e.location
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        WHERE er.user_email = $1
        AND er.status = 'registered'
        AND e.event_date >= CURRENT_DATE
        ORDER BY e.event_date ASC
        LIMIT 1;`;

        const result = await db.query(query, [user_email]);

        if (result.rows.length === 0) {
            console.log("No Upcoming Events");
            return "No Upcoming Events!";
        }
        console.log(result.rows[0]);
        return result.rows[0]; // next event
    }

    static async recentPastEvent(userEmail) {
        const query = `
        SELECT 
        e.id AS event_id,
        e.title, 
        e.event_date, 
        e.location
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        WHERE er.user_email = $1
        AND er.status = 'attended'
        AND e.event_date < CURRENT_DATE
        ORDER BY e.event_date DESC
        LIMIT 1;`;

        const result = await db.query(query, [userEmail]);

        if (result.rows.length === 0) {
            console.log("No Past Events");
            return "No Past Events!";
        }
        console.log(result.rows[0]);
        return result.rows[0]; // next event
    }

    static async feedback(feedbackInfo) {
        //console.log("Hello Test");
        //console.log(feedbackInfo);
        const query = `
        UPDATE feedback
        SET rating = $1
        WHERE user_email = $2
        AND event_id = $3
        RETURNING *;`;

        const result = await db.query(query, [
            feedbackInfo.rating,
            feedbackInfo.email,
            feedbackInfo.eventID,
        ]);
        //console.log(result.rows[0]);
        return result.rows[0];
    }
}

module.exports = HomePageEvents;
