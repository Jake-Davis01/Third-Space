const db = require("../database/connect");

class Event {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.event_date = data.event_date;
    this.location = data.location || "TBD";
    this.category_name =
      data.category_name || data.primary_category_name || null;
    this.user_email = data.user_email || null;
  }

  async save() {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const eventResult = await client.query(
        `
        INSERT INTO events (title, description, category_name, location, event_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [
          this.title,
          this.description,
          this.category_name,
          this.location,
          this.event_date,
        ]
      );

      const newEvent = eventResult.rows[0];

      if (this.user_email) {
        await client.query(
          `
          INSERT INTO event_registrations (user_email, event_id, status)
          VALUES ($1, $2, $3);
          `,
          [this.user_email, newEvent.id, "registered"]
        );

        await client.query(
          `
          INSERT INTO event_registrations (user_email, event_id, status)
          SELECT ui.user_email, $1, 'unresponsive'
          FROM user_interests ui
          WHERE LOWER(TRIM(ui.interest_name)) = LOWER(TRIM($2))
            AND ui.user_email != $3
          ON CONFLICT (user_email, event_id) DO NOTHING;
          `,
          [newEvent.id, this.category_name, this.user_email]
        );
      }

      await client.query("COMMIT");
      return newEvent;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error saving event:", err);
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
      GROUP BY e.id, e.title, e.description, e.category_name
      ORDER BY COUNT(er.id) DESC
      LIMIT 4;
    `);

    return result.rows;
  }

  static async getSuggestionInsights() {
    const categoryQuery = `
      SELECT
        e.category_name,
        COUNT(DISTINCT e.id) AS total_events,
        COUNT(er.id) AS total_registrations,
        COUNT(CASE WHEN er.status = 'attended' THEN 1 END) AS total_attended,
        COUNT(CASE WHEN er.status = 'cancelled' THEN 1 END) AS total_cancelled
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.category_name IS NOT NULL
      GROUP BY e.category_name
      ORDER BY total_registrations DESC, total_attended DESC;
    `;

    const locationQuery = `
      SELECT
        location,
        COUNT(*) AS total_events
      FROM events
      WHERE location IS NOT NULL
      GROUP BY location
      ORDER BY total_events DESC;
    `;

    const underusedQuery = `
      SELECT
        i.name AS category_name,
        COUNT(DISTINCT ui.user_email) AS interested_users,
        COUNT(DISTINCT e.id) AS total_events
      FROM interests i
      LEFT JOIN user_interests ui
        ON i.name = ui.interest_name
      LEFT JOIN events e
        ON i.name = e.category_name
      GROUP BY i.name
      HAVING COUNT(DISTINCT e.id) < 2
      ORDER BY interested_users DESC, total_events ASC;
    `;

    const [categories, locations, underused] = await Promise.all([
      db.query(categoryQuery),
      db.query(locationQuery),
      db.query(underusedQuery),
    ]);

    return {
      topCategories: categories.rows,
      topLocations: locations.rows,
      underusedCategories: underused.rows,
    };
  }
}

module.exports = Event;