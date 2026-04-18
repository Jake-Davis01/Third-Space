const fs = require("fs");
const path = require("path");
const pool = require("../../../server/database/connect"); // adjust path to your DB pool


// TEMP: disable DB setup for unit tests

beforeAll(async () => {
  // no-op
});

afterAll(async () => {
  // no-op
});

// beforeAll(async () => {
//   const resetSql = fs.readFileSync(
//     path.join(__dirname, "../intergration/reset.sql"),
//     "utf8"
//   );

//   const seedSql = fs.readFileSync(
//     path.join(__dirname, "../intergration/seed.sql"),
//     "utf8"
//   );

//   await pool.query(resetSql);
//   await pool.query(seedSql);
// });

// afterAll(async () => {
//   await pool.end(); // closes DB connection
// });