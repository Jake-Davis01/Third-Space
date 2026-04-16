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
        const query = `
        UPDATE event_registrations
        SET status = 'registered'
        WHERE id = $1;
        `;

        const result = await db.query(
            `UPDATE event_registrations
            SET status = 'registered'
            WHERE id = $1
            RETURNING *`,
            [eventRegistrationID],
        );

        return result.rows[0];
    }
}

module.exports = HomePageEvents;
