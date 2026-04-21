// mock the model BEFORE requiring controller
jest.mock("../../../../server/models/Dashboard", () => ({
  getInterests: jest.fn(),
  getAttendance: jest.fn(),
  getRatings: jest.fn(),
  getActiveUsers: jest.fn(),
  getRegistrationPercent: jest.fn(),
  getUserGrowth: jest.fn()
}));

const dashboardModel = require("../../../models/Dashboard");
const { getDashboard } = require("../../../controller/dashboard");

describe("getDashboard", () => {
  let req, res;

  beforeEach(() => {
    req = {};

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return dashboard data successfully", async () => {
    // mock resolved values
    dashboardModel.getInterests.mockResolvedValue({
      rows: [{ name: "Running" }]
    });

    dashboardModel.getAttendance.mockResolvedValue({
      rows: [{ event: "Run", count: 10 }]
    });

    dashboardModel.getRatings.mockResolvedValue({
      rows: [{ avg: 4.5 }]
    });

    dashboardModel.getActiveUsers.mockResolvedValue({
      rows: [{ count: 5 }]
    });

    dashboardModel.getRegistrationPercent.mockResolvedValue({
      rows: [{ percent: 80 }]
    });

    dashboardModel.getUserGrowth.mockResolvedValue({
      rows: [{ month: "April", users: 10 }]
    });

    await getDashboard(req, res);

    expect(res.json).toHaveBeenCalledWith({
      interests: [{ name: "Running" }],
      attendance: [{ event: "Run", count: 10 }],
      ratings: [{ avg: 4.5 }],
      activeUsers: 5,
      registrationPercent: 80,
      userGrowth: [{ month: "April", users: 10 }]
    });
  });

  test("should return 500 if something fails", async () => {
    dashboardModel.getInterests.mockRejectedValue(new Error("DB error"));

    await getDashboard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Dashboard failed"
    });
  });
});