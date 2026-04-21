jest.mock("../../../models/Event", () => ({
  getUserEvents: jest.fn(),
  cancelEvent: jest.fn(),
}));

const Event = require("../../../models/Event");
const { userEvents, cancelEvent } = require("../../../controller/eventsPageController");

describe("Events Controller", () => {
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

  // ─── userEvents ────────────────────────────────────────────────────────────

  describe("userEvents", () => {
    test("returns 200 with the user's events", async () => {
      req.params.userEmail = "alice@test.com";
      const mockResult = [{ id: 1, title: "Morning Run" }];
      Event.getUserEvents.mockResolvedValue(mockResult);

      await userEvents(req, res);

      expect(Event.getUserEvents).toHaveBeenCalledWith("alice@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test("returns 401 on error", async () => {
      req.params.userEmail = "alice@test.com";
      Event.getUserEvents.mockRejectedValue(new Error("DB error"));

      await userEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  // ─── cancelEvent ───────────────────────────────────────────────────────────

  describe("cancelEvent", () => {
    test("returns 200 with the cancelled registration", async () => {
      req.body = { email: "alice@test.com", eventID: 1 };
      const mockResult = { id: 5, status: "cancelled" };
      Event.cancelEvent.mockResolvedValue(mockResult);

      await cancelEvent(req, res);

      expect(Event.cancelEvent).toHaveBeenCalledWith({ email: "alice@test.com", eventID: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test("returns 401 on error", async () => {
      req.body = { email: "alice@test.com", eventID: 1 };
      Event.cancelEvent.mockRejectedValue(new Error("DB error"));

      await cancelEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });
});