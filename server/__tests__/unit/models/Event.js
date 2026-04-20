const db = require("../../../database/connect");
const Event = require("../../../models/Event");

jest.mock("../../../database/connect");

describe("Event Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEventData = {
    title: "Morning Run",
    description: "A casual 5K run.",
    event_date: "2026-04-20",
    location: "London",
    primary_category_name: "Running",
    user_email: "alice@test.com",
  };

  const mockEventRow = {
    id: 1,
    title: "Morning Run",
    description: "A casual 5K run.",
    category_name: "Running",
    location: "London",
    event_date: "2026-04-20",
  };

  // ─── save ──────────────────────────────────────────────────────────────────

  describe("save", () => {
    let mockClient;

    beforeEach(() => {
      mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      };
      db.connect.mockResolvedValue(mockClient);
    });

    it("runs queries inside a transaction and returns the new event", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })              // BEGIN
        .mockResolvedValueOnce({ rows: [mockEventRow] })  // INSERT event
        .mockResolvedValueOnce({ rows: [] })              // INSERT creator registration
        .mockResolvedValueOnce({ rows: [] })              // INSERT unresponsive registrations
        .mockResolvedValueOnce({ rows: [] });             // COMMIT

      const event = new Event(mockEventData);
      const result = await event.save();

      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
      expect(result).toEqual(mockEventRow);
    });

    it("releases the client after a successful save", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockEventRow] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const event = new Event(mockEventData);
      await event.save();
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });

    it("rolls back and releases the client on error", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })          // BEGIN
        .mockRejectedValueOnce(new Error("DB error")) // INSERT event fails
        .mockResolvedValueOnce({ rows: [] });         // ROLLBACK

      const event = new Event(mockEventData);
      await expect(event.save()).rejects.toThrow("DB error");
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });
  });

  // ─── getPopularEvents ──────────────────────────────────────────────────────

  describe("getPopularEvents", () => {
    it("returns up to 4 events ordered by registration count", async () => {
      const mockRows = [
        { id: 1, title: "Morning Run", interested_count: "10" },
        { id: 2, title: "Film Night", interested_count: "8" },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await Event.getPopularEvents();
      expect(result).toEqual(mockRows);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("returns an empty array when there are no events", async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await Event.getPopularEvents();
      expect(result).toEqual([]);
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(Event.getPopularEvents()).rejects.toThrow("DB error");
    });
  });

  // ─── getUserEvents ─────────────────────────────────────────────────────────

  describe("getUserEvents", () => {
    it("returns upcoming registered events for the user", async () => {
      const mockRows = [
        { id: 1, title: "Morning Run", event_date: "20/04/2026", location: "London" },
        { id: 2, title: "Film Night", event_date: "22/04/2026", location: "Edinburgh" },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const result = await Event.getUserEvents("alice@test.com");
      expect(result).toEqual(mockRows);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), ["alice@test.com"]);
    });

    it("returns an empty array when the user has no upcoming events", async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await Event.getUserEvents("alice@test.com");
      expect(result).toEqual([]);
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(Event.getUserEvents("alice@test.com")).rejects.toThrow("DB error");
    });
  });

  // ─── cancelEvent ───────────────────────────────────────────────────────────

  describe("cancelEvent", () => {
    it("cancels the registration and returns the updated row", async () => {
      const mockRow = { id: 5, user_email: "alice@test.com", event_id: 1, status: "cancelled" };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await Event.cancelEvent({ email: "alice@test.com", eventID: 1 });
      expect(result).toEqual(mockRow);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), ["alice@test.com", 1]);
    });

    it("returns undefined when no matching registration is found", async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await Event.cancelEvent({ email: "ghost@test.com", eventID: 99 });
      expect(result).toBeUndefined();
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(Event.cancelEvent({ email: "alice@test.com", eventID: 1 })).rejects.toThrow("DB error");
    });
  });
});