const db = require("../../../database/connect");
const Event = require("../../../models/Aisuggestions");

jest.mock("../../../database/connect");

function makeMockClient() {
  const client = {
    query: jest.fn(),
    release: jest.fn(),
  };

  client.query.mockImplementation((sql) => {
    if (/BEGIN|COMMIT|ROLLBACK/i.test(sql)) return Promise.resolve({});
    return Promise.resolve({ rows: [] });
  });

  return client;
}

beforeEach(() => jest.clearAllMocks());

/* ───────────────────────── save() ───────────────────────── */

describe("Event#save", () => {
  it("handles full flow including categories + user registration", async () => {
    const client = makeMockClient();
    db.connect.mockResolvedValue(client);

    const newRow = { id: 1, title: "Run Club" };

    client.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [newRow] }) // insert event
      .mockResolvedValue({}); // rest

    const event = new Event({
      title: "Run Club",
      event_date: "2025-06-01",
      category_name: "Running",
      categories: ["Running", " Fitness "], // tests trimming + dedupe
      user_email: "test@test.com",
    });

    const result = await event.save();

    expect(result).toEqual(newRow);
    expect(client.query).toHaveBeenCalledWith(expect.stringMatching(/COMMIT/i));
    expect(client.release).toHaveBeenCalled();
  });

  it("rolls back on failure", async () => {
    const client = makeMockClient();
    db.connect.mockResolvedValue(client);

    client.query
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("fail"));

    await expect(
      new Event({ title: "Bad" }).save()
    ).rejects.toThrow("fail");

    expect(client.query).toHaveBeenCalledWith(expect.stringMatching(/ROLLBACK/i));
  });
});

/* ─────────────────────── getAllEvents ───────────────────── */

describe("Event.getAllEvents", () => {
  it("returns rows and propagates errors", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    expect(await Event.getAllEvents()).toEqual([{ id: 1 }]);

    db.query.mockRejectedValueOnce(new Error("DB"));
    await expect(Event.getAllEvents()).rejects.toThrow("DB");
  });
});

/* ─────────────────────── updateById ─────────────────────── */

describe("Event.updateById", () => {
  it("handles not found, success, and rollback", async () => {
    const client = makeMockClient();
    db.connect.mockResolvedValue(client);

    // not found
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [] });

    expect(await Event.updateById(1, {})).toBeNull();

    // success
    const existing = { id: 1, title: "Old", category_name: "Running" };
    const updated = { ...existing, title: "New" };

    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [existing] })
      .mockResolvedValueOnce({ rows: [updated] })
      .mockResolvedValueOnce({});

    db.query.mockResolvedValue({ rows: [updated] });

    const result = await Event.updateById(1, { title: "New", categories: ["Running"] });
    expect(result.title).toBe("New");

    // failure
    client.query
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("fail"));

    await expect(Event.updateById(1, {})).rejects.toThrow("fail");
  });
});

/* ─────────────────────── deleteById ─────────────────────── */

describe("Event.deleteById", () => {
  it("returns row or null", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    expect(await Event.deleteById(1)).toEqual({ id: 1 });

    db.query.mockResolvedValueOnce({ rows: [] });
    expect(await Event.deleteById(999)).toBeNull();
  });
});

/* ───────────────────── getPopularEvents ─────────────────── */

describe("Event.getPopularEvents", () => {
  it("returns rows and handles errors", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    expect(await Event.getPopularEvents()).toEqual([{ id: 1 }]);

    db.query.mockRejectedValueOnce(new Error("DB"));
    await expect(Event.getPopularEvents()).rejects.toThrow("DB");
  });
});

/* ───────────────── getSuggestionInsights ───────────────── */

describe("Event.getSuggestionInsights", () => {
  it("builds full structure correctly", async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ category_name: "Running" }] }) // interests
      .mockResolvedValueOnce({ rows: [{ location: "London" }] }) // locations
      .mockResolvedValueOnce({
        rows: [{ category_name: "Running", location: "London", rn: 1 }],
      })
      .mockResolvedValueOnce({ rows: [{ category_name: "Chess" }] });

    const result = await Event.getSuggestionInsights();

    expect(result.topInterests.length).toBe(1);
    expect(result.topThreeInterests.length).toBe(1);
    expect(result.categoryBestLocations[0].best_location).toBe("London");
    expect(result.underusedCategories.length).toBe(1);
  });
});

/* ───── getInterestedCountByCategoryAndLocation ─────────── */

describe("Event.getInterestedCountByCategoryAndLocation", () => {
  it("handles all branches", async () => {
    // no category
    expect(await Event.getInterestedCountByCategoryAndLocation(null, "x")).toBe(0);

    // no location
    db.query.mockResolvedValueOnce({ rows: [{ interested_count: "3" }] });
    expect(await Event.getInterestedCountByCategoryAndLocation("Running", "")).toBe(3);

    // fully remote
    db.query.mockResolvedValueOnce({ rows: [{ interested_count: "4" }] });
    await Event.getInterestedCountByCategoryAndLocation("Running", "Fully remote");

    expect(db.query.mock.calls[1][0]).not.toMatch(/office_location/i);

    // office-based
    db.query.mockResolvedValueOnce({ rows: [{ interested_count: "5" }] });
    expect(await Event.getInterestedCountByCategoryAndLocation("Running", "London")).toBe(5);
  });
});

/* ───────────── getIdeaValidationInsights ───────────── */

describe("Event.getIdeaValidationInsights", () => {
  it("handles match, suggestion, and stats branches", async () => {
    db.query
      // interests list
      .mockResolvedValueOnce({ rows: [{ name: "Running" }, { name: "Chess" }] })
      // category stats
      .mockResolvedValueOnce({ rows: [{}] })
      // interest stats
      .mockResolvedValueOnce({ rows: [{}] })
      // location stats
      .mockResolvedValueOnce({ rows: [] })
      // top interests
      .mockResolvedValueOnce({ rows: [] });

    const result = await Event.getIdeaValidationInsights("weekly running club");

    expect(result.matchedCategory).toBe("Running");
    expect(result.finalCategory).toBe("Running");
    expect(result.topMatchCandidates.length).toBeGreaterThan(0);
  });

  it("propagates DB errors", async () => {
    db.query.mockRejectedValue(new Error("DB"));

    await expect(
      Event.getIdeaValidationInsights("test")
    ).rejects.toThrow("DB");
  });
});