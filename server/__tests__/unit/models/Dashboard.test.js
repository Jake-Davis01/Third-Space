const db = require("../../../database/connect");
const {
  getInterests,
  getAttendance,
  getRatings,
  getActiveUsers,
  getRegistrationPercent,
  getUserGrowth,
} = require("../../../models/Dashboard");

jest.mock("../../../database/connect");

describe("Dashboard Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── 1. getInterests ───────────────────────────────────────────────────────

  describe("getInterests", () => {
    it("calls db.query once", () => {
      db.query.mockResolvedValue({ rows: [] });
      getInterests();
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("returns rows with name and count fields", async () => {
      const mockRows = [
        { name: "Music", count: "15" },
        { name: "Sport", count: "10" },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await getInterests();
      expect(result.rows).toEqual(mockRows);
      expect(result.rows[0]).toHaveProperty("name");
      expect(result.rows[0]).toHaveProperty("count");
    });

    it("returns rows ordered by count descending", async () => {
      const mockRows = [
        { name: "Music", count: "20" },
        { name: "Art", count: "10" },
        { name: "Tech", count: "5" },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await getInterests();
      const counts = result.rows.map((r) => Number(r.count));
      expect(counts).toEqual([...counts].sort((a, b) => b - a));
    });

    it("returns an empty array when there are no user interests", async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await getInterests();
      expect(result.rows).toHaveLength(0);
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(getInterests()).rejects.toThrow("DB error");
    });

    it("sends a query that references user_interests and interests tables", () => {
      db.query.mockResolvedValue({ rows: [] });
      getInterests();
      const sql = db.query.mock.calls[0][0];
      expect(sql).toMatch(/user_interests/i);
      expect(sql).toMatch(/interests/i);
      expect(sql).toMatch(/GROUP BY/i);
      expect(sql).toMatch(/ORDER BY/i);
    });
  });

  // ─── 2. getAttendance ─────────────────────────────────────────────────────

  describe("getAttendance", () => {
    it("calls db.query once", () => {
      db.query.mockResolvedValue({ rows: [] });
      getAttendance();
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("returns rows with name and count fields", async () => {
      const mockRows = [
        { name: "Music", count: "8" },
        { name: "Sport", count: "3" },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await getAttendance();
      expect(result.rows).toEqual(mockRows);
      expect(result.rows[0]).toHaveProperty("name");
      expect(result.rows[0]).toHaveProperty("count");
    });

    it("only counts attended registrations", () => {
      db.query.mockResolvedValue({ rows: [] });
      getAttendance();
      const sql = db.query.mock.calls[0][0];
      expect(sql).toMatch(/attended/i);
    });

    it("returns an empty array when there are no attended events", async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await getAttendance();
      expect(result.rows).toHaveLength(0);
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(getAttendance()).rejects.toThrow("DB error");
    });

    it("sends a query that references event_registrations and events tables", () => {
      db.query.mockResolvedValue({ rows: [] });
      getAttendance();
      const sql = db.query.mock.calls[0][0];
      expect(sql).toMatch(/event_registrations/i);
      expect(sql).toMatch(/events/i);
    });
  });

  // ─── 3. getRatings ────────────────────────────────────────────────────────

  describe("getRatings", () => {
    it("calls db.query once", () => {
      db.query.mockResolvedValue({ rows: [] });
      getRatings();
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("returns rows with name and avg_rating fields", async () => {
      const mockRows = [
        { name: "Music", avg_rating: "4.8" },
        { name: "Art", avg_rating: "4.2" },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await getRatings();
      expect(result.rows).toEqual(mockRows);
      expect(result.rows[0]).toHaveProperty("name");
      expect(result.rows[0]).toHaveProperty("avg_rating");
    });

    it("returns rows ordered by avg_rating descending", async () => {
      const mockRows = [
        { name: "Music", avg_rating: "4.9" },
        { name: "Art", avg_rating: "4.5" },
        { name: "Tech", avg_rating: "3.1" },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await getRatings();
      const ratings = result.rows.map((r) => Number(r.avg_rating));
      expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
    });

    it("returns an empty array when there is no feedback", async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await getRatings();
      expect(result.rows).toHaveLength(0);
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(getRatings()).rejects.toThrow("DB error");
    });

    it("sends a query that uses AVG on the rating column", () => {
      db.query.mockResolvedValue({ rows: [] });
      getRatings();
      const sql = db.query.mock.calls[0][0];
      expect(sql).toMatch(/AVG/i);
      expect(sql).toMatch(/feedback/i);
    });
  });

  // ─── 4. getActiveUsers ────────────────────────────────────────────────────

  describe("getActiveUsers", () => {
    it("calls db.query once", () => {
      db.query.mockResolvedValue({ rows: [{ count: "320" }] });
      getActiveUsers();
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("returns a single row with a count field", async () => {
      db.query.mockResolvedValue({ rows: [{ count: "320" }] });
      const result = await getActiveUsers();
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toHaveProperty("count");
    });

    it("returns zero when there are no users", async () => {
      db.query.mockResolvedValue({ rows: [{ count: "0" }] });
      const result = await getActiveUsers();
      expect(result.rows[0].count).toBe("0");
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(getActiveUsers()).rejects.toThrow("DB error");
    });

    it("sends a query that performs COUNT on the users table", () => {
      db.query.mockResolvedValue({ rows: [] });
      getActiveUsers();
      const sql = db.query.mock.calls[0][0];
      expect(sql).toMatch(/COUNT/i);
      expect(sql).toMatch(/users/i);
    });
  });

  // ─── 5. getRegistrationPercent ────────────────────────────────────────────

  describe("getRegistrationPercent", () => {
    it("calls db.query once", () => {
      db.query.mockResolvedValue({ rows: [{ percent: "64" }] });
      getRegistrationPercent();
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("returns a single row with a percent field", async () => {
      db.query.mockResolvedValue({ rows: [{ percent: "64" }] });
      const result = await getRegistrationPercent();
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toHaveProperty("percent");
    });

    it("returns 0 percent when there are no registrations", async () => {
      db.query.mockResolvedValue({ rows: [{ percent: "0" }] });
      const result = await getRegistrationPercent();
      expect(result.rows[0].percent).toBe("0");
    });

    it("returns 100 percent when all users have registered", async () => {
      db.query.mockResolvedValue({ rows: [{ percent: "100" }] });
      const result = await getRegistrationPercent();
      expect(result.rows[0].percent).toBe("100");
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(getRegistrationPercent()).rejects.toThrow("DB error");
    });

    it("sends a query that references event_registrations and uses ROUND", () => {
      db.query.mockResolvedValue({ rows: [] });
      getRegistrationPercent();
      const sql = db.query.mock.calls[0][0];
      expect(sql).toMatch(/event_registrations/i);
      expect(sql).toMatch(/ROUND/i);
    });
  });

  // ─── 6. getUserGrowth ─────────────────────────────────────────────────────

  describe("getUserGrowth", () => {
    it("calls db.query once", () => {
      db.query.mockResolvedValue({ rows: [] });
      getUserGrowth();
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("returns rows with month_label and cumulative_users fields", async () => {
      const mockRows = [
        { month_label: "Jan 2024", cumulative_users: "50" },
        { month_label: "Feb 2024", cumulative_users: "120" },
        { month_label: "Mar 2024", cumulative_users: "210" },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await getUserGrowth();
      expect(result.rows).toEqual(mockRows);
      expect(result.rows[0]).toHaveProperty("month_label");
      expect(result.rows[0]).toHaveProperty("cumulative_users");
    });

    it("returns cumulative totals that are non-decreasing", async () => {
      const mockRows = [
        { month_label: "Jan 2024", cumulative_users: "50" },
        { month_label: "Feb 2024", cumulative_users: "120" },
        { month_label: "Mar 2024", cumulative_users: "210" },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await getUserGrowth();
      const totals = result.rows.map((r) => Number(r.cumulative_users));
      for (let i = 1; i < totals.length; i++) {
        expect(totals[i]).toBeGreaterThanOrEqual(totals[i - 1]);
      }
    });

    it("returns an empty array when there are no users", async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await getUserGrowth();
      expect(result.rows).toHaveLength(0);
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(getUserGrowth()).rejects.toThrow("DB error");
    });

    it("sends a query that uses a cumulative SUM window function", () => {
      db.query.mockResolvedValue({ rows: [] });
      getUserGrowth();
      const sql = db.query.mock.calls[0][0];
      expect(sql).toMatch(/SUM/i);
      expect(sql).toMatch(/OVER/i);
      expect(sql).toMatch(/DATE_TRUNC/i);
    });

    it("formats month labels correctly", async () => {
      const mockRows = [{ month_label: "Jan 2024", cumulative_users: "50" }];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await getUserGrowth();
      expect(result.rows[0].month_label).toMatch(/^[A-Z][a-z]{2} \d{4}$/);
    });
  });
});