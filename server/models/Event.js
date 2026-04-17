const db = require("../database/connect");

class Event {
  constructor({
    title,
    description,
    event_date,
    location,
    primary_category_name,
    user_email, // 👈 IMPORTANT (comes from frontend)
  }) {
    this.title = title;
    this.description = description;
    this.event_date = event_date;
    this.location = location;
    this.category_name = primary_category_name;
    this.user_email = user_email;
  }

  // ✅ Create new event + register creator
  async save() {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // 1️⃣ Insert event
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

      // 2️⃣ Insert into event_registrations
      await client.query(
        `INSERT INTO event_registrations (user_email, event_id, status)
         VALUES ($1, $2, $3)`,
        [
          this.user_email,
          newEvent.id,
          "registered", // or "unresponsive" if you want pending instead
        ]
      );

      await client.query("COMMIT");

      return newEvent;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error saving event + registration:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  static async getPopularEvents() {
    try {
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
    } catch (err) {
      console.error("Error fetching popular events:", err);
      throw err;
    }
  }
}

module.exports = Event;