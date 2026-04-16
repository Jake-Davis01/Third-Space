const express = require("express");
const router = express.Router();

// NOTE: you must import your db connection here
// adjust path depending on your project structure
const db = require("../database/connect"); // <-- IMPORTANT (see note below)

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    // 1. Top interests
    const interests = await db.query(`
      SELECT i.name, COUNT(*) as count
      FROM user_interests ui
      JOIN interests i ON ui.interest_id = i.id
      GROUP BY i.name
      ORDER BY count DESC;
    `);

    // 2. Attendance by event category
    const attendance = await db.query(`
      SELECT i.name, COUNT(*) as count
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      JOIN interests i ON e.category_id = i.id
      WHERE er.status = 'attended'
      GROUP BY i.name
      ORDER BY count DESC;
    `);

    // 3. Average rating by category
    const ratings = await db.query(`
      SELECT i.name, AVG(f.rating) as avg_rating
      FROM feedback f
      JOIN events e ON f.event_id = e.id
      JOIN interests i ON e.category_id = i.id
      GROUP BY i.name
      ORDER BY avg_rating DESC;
    `);

    // 4. KPIs
    const activeUsers = await db.query(`
      SELECT COUNT(*) FROM users;
    `);

    const registeredPercent = await db.query(`
      SELECT 
      ROUND(
        COUNT(DISTINCT user_id)::numeric / 500 * 100
      ) AS percent
    FROM event_registrations;
    `);

    const userGrowth = await db.query(`
    SELECT 
      TO_CHAR(month, 'Mon YYYY') AS month_label,
      SUM(users_count) OVER (ORDER BY month) AS cumulative_users
    FROM (
      SELECT 
        DATE_TRUNC('month', created_at) AS month,
        COUNT(*) AS users_count
      FROM users
      GROUP BY month
    ) sub
    ORDER BY month;
    `);

    res.json({
      interests: interests.rows,
      attendance: attendance.rows,
      ratings: ratings.rows,
      activeUsers: activeUsers.rows[0].count,
      registrationPercent: registeredPercent.rows[0].percent,
      userGrowth: userGrowth.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard failed" });
  }
});

module.exports = router;