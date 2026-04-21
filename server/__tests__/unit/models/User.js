const db = require("../../../database/connect");
const User = require("../../../models/User");

jest.mock("../../../database/connect");

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserRow = {
    id: 1,
    first_name: "Alice",
    last_name: "Smith",
    email: "alice@test.com",
    password_hash: "hash123",
    user_interests: null,
    job_role: "employee",
    meetup_preference: "in-person",
    office_location: "London",
  };

  // ─── getOneById ────────────────────────────────────────────────────────────

  describe("getOneById", () => {
    it("returns a User instance with correct properties", async () => {
      db.query.mockResolvedValue({ rows: [mockUserRow] });
      const result = await User.getOneById(1);
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.firstName).toBe("Alice");
    });

    it("throws when no user is found", async () => {
      db.query.mockResolvedValue({ rows: [] });
      await expect(User.getOneById(999)).rejects.toThrow("Unable to locate user.");
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(User.getOneById(1)).rejects.toThrow("DB error");
    });
  });

  // ─── getOneByEmail ─────────────────────────────────────────────────────────

  describe("getOneByEmail", () => {
    it("returns a User instance with interests attached", async () => {
      db.query
        .mockResolvedValueOnce({ rows: [mockUserRow] })
        .mockResolvedValueOnce({ rows: [{ interest_name: "Running" }, { interest_name: "Film" }] });

      const result = await User.getOneByEmail("alice@test.com");
      expect(result).toBeInstanceOf(User);
      expect(result.userInterests).toEqual(["Running", "Film"]);
    });

    it("returns an empty interests array when the user has none", async () => {
      db.query
        .mockResolvedValueOnce({ rows: [mockUserRow] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await User.getOneByEmail("alice@test.com");
      expect(result.userInterests).toEqual([]);
    });

    it("throws when no user is found", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(User.getOneByEmail("ghost@test.com")).rejects.toThrow("Unable to locate user.");
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      await expect(User.getOneByEmail("alice@test.com")).rejects.toThrow("DB error");
    });
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe("create", () => {
    const mockData = {
      first_name: "Charlie",
      last_name: "Brown",
      email: "charlie@test.com",
      password: "securepassword",
      user_interests: ["Hiking", "Photography"],
      meetup_preference: "remote",
      office_location: "Manchester",
    };

    const mockCreatedRow = { ...mockUserRow, id: 3, first_name: "Charlie", email: "charlie@test.com" };

    it("inserts user and interests then returns a User instance", async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 3 }] }) // INSERT user
        .mockResolvedValueOnce({ rows: [] })            // INSERT interest 1
        .mockResolvedValueOnce({ rows: [] })            // INSERT interest 2
        .mockResolvedValueOnce({ rows: [mockCreatedRow] }); // getOneById

      const result = await User.create(mockData);
      expect(result).toBeInstanceOf(User);
      // 1 user insert + 2 interest inserts + 1 getOneById
      expect(db.query).toHaveBeenCalledTimes(4);
    });

    it("handles a user with no interests", async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 3 }] })
        .mockResolvedValueOnce({ rows: [mockCreatedRow] });

      await User.create({ ...mockData, user_interests: [] });
      // 1 user insert + 0 interests + 1 getOneById
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValueOnce(new Error("DB error"));
      await expect(User.create(mockData)).rejects.toThrow("DB error");
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe("update", () => {
    const mockData = {
      office_location: "Edinburgh",
      meetup_preference: "hybrid",
      user_interests: ["Yoga", "Cycling"],
    };

    it("updates user, replaces interests and returns updated User instance", async () => {
      db.query
        .mockResolvedValueOnce({ rows: [] })            // UPDATE users
        .mockResolvedValueOnce({ rows: [] })            // DELETE user_interests
        .mockResolvedValueOnce({ rows: [] })            // INSERT interest 1
        .mockResolvedValueOnce({ rows: [] })            // INSERT interest 2
        .mockResolvedValueOnce({ rows: [mockUserRow] }) // getOneByEmail - user
        .mockResolvedValueOnce({ rows: [{ interest_name: "Yoga" }, { interest_name: "Cycling" }] }); // getOneByEmail - interests

      const result = await User.update("alice@test.com", mockData);
      expect(result).toBeInstanceOf(User);
      expect(result.userInterests).toEqual(["Yoga", "Cycling"]);
      // 1 UPDATE + 1 DELETE + 2 inserts + 2 getOneByEmail queries
      expect(db.query).toHaveBeenCalledTimes(6);
    });

    it("handles updating to an empty interests list", async () => {
      db.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockUserRow] })
        .mockResolvedValueOnce({ rows: [] });

      await User.update("alice@test.com", { ...mockData, user_interests: [] });
      // 1 UPDATE + 1 DELETE + 0 inserts + 2 getOneByEmail queries
      expect(db.query).toHaveBeenCalledTimes(4);
    });

    it("propagates a database error", async () => {
      db.query.mockRejectedValueOnce(new Error("DB error"));
      await expect(User.update("alice@test.com", mockData)).rejects.toThrow("DB error");
    });
  });
});