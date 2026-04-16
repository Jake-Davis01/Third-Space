const db = require("../database/connect");

// 1. Top interests
const getInterests = () => {
  return db.query(`
    SELECT i.name, COUNT(*) as count
    FROM user_interests ui
    JOIN interests i ON ui.interest_id = i.id
    GROUP BY i.name
    ORDER BY count DESC;
  `);
};

// 2. Attendance
const getAttendance = () => {
  return db.query(`
    SELECT i.name, COUNT(*) as count
    FROM event_registrations er
    JOIN events e ON er.event_id = e.id
    JOIN interests i ON e.category_id = i.id
    WHERE er.status = 'attended'
    GROUP BY i.name
    ORDER BY count DESC;
  `);
};

// 3. Ratings
const getRatings = () => {
  return db.query(`
    SELECT i.name, AVG(f.rating) as avg_rating
    FROM feedback f
    JOIN events e ON f.event_id = e.id
    JOIN interests i ON e.category_id = i.id
    GROUP BY i.name
    ORDER BY avg_rating DESC;
  `);
};

// 4. KPIs
const getActiveUsers = () => {
  return db.query(`SELECT COUNT(*) FROM users;`);
};

const getRegistrationPercent = () => {
  return db.query(`
    SELECT 
      ROUND(
        COUNT(DISTINCT user_id)::numeric / 500 * 100
      ) AS percent
    FROM event_registrations;
  `);
};

// 5. Line chart data
const getUserGrowth = () => {
  return db.query(`
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
};

module.exports = {
  getInterests,
  getAttendance,
  getRatings,
  getActiveUsers,
  getRegistrationPercent,
  getUserGrowth
};