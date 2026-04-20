jest.mock("../../../../server/models/HomePageEvents", () => ({
  getNewEvent: jest.fn(),
  joinEvent: jest.fn(),
  nextEvent: jest.fn(),
  recentPastEvent: jest.fn(),
  feedback: jest.fn(),
}));

const HomePageEvents = require("../../../../server/models/HomePageEvents");
const {
  newUserEvent,
  joinEvent,
  nextEvent,
  recentPastEvent,
  feedback,
} = require("../../../../server/controller/homeController");

describe("Home Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── newUserEvent ──────────────────────────────────────────────────────────

  describe("newUserEvent", () => {
    test("returns 200 with the new event", async () => {
      req.params.userEmail = "alice@test.com";
      const mockResult = { id: 1, title: "Morning Run" };
      HomePageEvents.getNewEvent.mockResolvedValue(mockResult);

      await newUserEvent(req, res);

      expect(HomePageEvents.getNewEvent).toHaveBeenCalledWith("alice@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

  });

  // ─── joinEvent ─────────────────────────────────────────────────────────────

  describe("joinEvent", () => {
    test("returns 200 with the updated registration", async () => {
      req.params.id = 5;
      const mockResult = { id: 5, status: "registered" };
      HomePageEvents.joinEvent.mockResolvedValue(mockResult);

      await joinEvent(req, res);

      expect(HomePageEvents.joinEvent).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

  });

  // ─── nextEvent ─────────────────────────────────────────────────────────────

  describe("nextEvent", () => {
    test("returns 200 with the next upcoming event", async () => {
      req.params.userEmail = "alice@test.com";
      const mockResult = { id: 2, title: "Film Night", event_date: "22/04/2026" };
      HomePageEvents.nextEvent.mockResolvedValue(mockResult);

      await nextEvent(req, res);

      expect(HomePageEvents.nextEvent).toHaveBeenCalledWith("alice@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

  });

  // ─── recentPastEvent ───────────────────────────────────────────────────────

  describe("recentPastEvent", () => {
    test("returns 200 with the most recent past event", async () => {
      req.params.userEmail = "alice@test.com";
      const mockResult = { event_id: 1, title: "Morning Run" };
      HomePageEvents.recentPastEvent.mockResolvedValue(mockResult);

      await recentPastEvent(req, res);

      expect(HomePageEvents.recentPastEvent).toHaveBeenCalledWith("alice@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

  });

  // ─── feedback ──────────────────────────────────────────────────────────────

  describe("feedback", () => {
    test("returns 200 with the saved feedback", async () => {
      req.body = { email: "alice@test.com", eventID: 1, rating: 5, comment: "Great!" };
      const mockResult = { id: 10, rating: 5, wasInserted: true };
      HomePageEvents.feedback.mockResolvedValue(mockResult);

      await feedback(req, res);

      expect(HomePageEvents.feedback).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test("returns 401 on error", async () => {
      HomePageEvents.feedback.mockRejectedValue(new Error("DB error"));
      await feedback(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });
});