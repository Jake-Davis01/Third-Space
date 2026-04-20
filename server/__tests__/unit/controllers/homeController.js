// mock model BEFORE importing controller
jest.mock("../../../../server/models/HomePageEvents", () => ({
  getNewEvent: jest.fn(),
  joinEvent: jest.fn()
}));

const HomePageEvents = require("../../../../server/models/HomePageEvents");
const {
  newUserEvent,
  joinEvent
} = require("../../../../server/controller/homeController");

describe("HomePageEvents controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // newUserEvent
  // =========================
  describe("newUserEvent", () => {
    test("should return event for user", async () => {
      req.params.userEmail = "test@test.com";

      const mockResult = { id: 1, title: "Event" };

      HomePageEvents.getNewEvent.mockResolvedValue(mockResult);

      await newUserEvent(req, res);

      expect(HomePageEvents.getNewEvent).toHaveBeenCalledWith("test@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test("should return 401 on error", async () => {
      req.params.userEmail = "test@test.com";

      HomePageEvents.getNewEvent.mockRejectedValue(new Error("DB error"));

      await newUserEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "DB error"
      });
    });
  });

  // =========================
  // joinEvent
  // =========================
  describe("joinEvent", () => {
    test("should join event successfully", async () => {
      req.params.id = 123;

      const mockResult = { success: true };

      HomePageEvents.joinEvent.mockResolvedValue(mockResult);

      await joinEvent(req, res);

      expect(HomePageEvents.joinEvent).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test("should return 401 on error", async () => {
      req.params.id = 123;

      HomePageEvents.joinEvent.mockRejectedValue(new Error("Join failed"));

      await joinEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Join failed"
      });
    });
  });
});