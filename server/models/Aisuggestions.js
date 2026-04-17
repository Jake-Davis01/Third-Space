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
}

module.exports = Event;