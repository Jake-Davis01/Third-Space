const db = require("../database/connect");

class Event {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.event_date = data.event_date;
        this.location = data.location || "TBD";
        this.category_name = data.category_name || null;
    }

    async save() {
        const query = `
      INSERT INTO events (title, description, event_date, location, category_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

        const values = [
            this.title,
            this.description,
            this.event_date,
            this.location,
            this.category_name,
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async getUserEvents(userEmail) {
        const query = `
        SELECT 
            e.id,
            e.title,
            TO_CHAR(e.event_date, 'DD/MM/YYYY') AS event_date,
            e.location
        FROM event_registrations er
        JOIN events e 
            ON er.event_id = e.id
        WHERE er.user_email = $1
            AND er.status = 'registered'
            AND e.event_date >= CURRENT_DATE
        ORDER BY e.event_date ASC;
        `;

        const result = await db.query(query, [userEmail]);
        return result.rows;
    }

    static async cancelEvent(eventToCancel) {
        const userEmail = eventToCancel.email
        const eventID = eventToCancel.eventID
        const query = `
        UPDATE event_registrations
        SET status = 'cancelled'
        WHERE user_email = $1
            AND event_id = $2
        RETURNING *;
        `;

        const result = await db.query(query, [userEmail, eventID]);
        return result.rows[0];
    }
}

module.exports = Event;
