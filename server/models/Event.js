const db = require("../database/connect");

class Event {
  constructor({
    title,
    description,
    event_date,
    location,
    primary_category_name,
    user_email,
  }) {
    this.title = title;
    this.description = description;
    this.event_date = event_date;
    this.location = location;
    this.category_name = primary_category_name;
    this.user_email = user_email;
  }

  async save() {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // Create event
      const eventResult = await client.query(
        `INSERT INTO events (title, description, category_name, location, event_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          this.title,
          this.description,
          this.category_name,
          this.location,
          this.event_date,
        ]
      );

      const newEvent = eventResult.rows[0];

      //Register creator (confirmed)
      await client.query(
        `INSERT INTO event_registrations (user_email, event_id, status)
         VALUES ($1, $2, $3)`,
        [this.user_email, newEvent.id, "registered"]
      );

      console.log("CATEGORY BEING USED:", this.category_name);

await client.query(
  `INSERT INTO event_registrations (user_email, event_id, status)
   SELECT ui.user_email, $1, 'unresponsive'
   FROM user_interests ui
   WHERE LOWER(TRIM(ui.interest_name)) = LOWER(TRIM($2))
   AND ui.user_email != $3
  `,
  [newEvent.id, this.category_name, this.user_email]
);

      await client.query("COMMIT");

      return newEvent;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error saving event + registrations:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  static async getPopularEvents() {
    const result = await db.query(`
      SELECT 
        e.id,
        e.title,
        e.description,
        e.category_name,
        COUNT(er.id) AS interested_count
      FROM events e
      LEFT JOIN event_registrations er 
        ON e.id = er.event_id
      GROUP BY e.id
      ORDER BY interested_count DESC
      LIMIT 4;
    `);

    return result.rows;
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
