// mock model BEFORE importing controller
jest.mock("../../../../server/models/User", () => ({
  create: jest.fn(),
  getOneByEmail: jest.fn()
}));

const User = require("../../../../server/models/User");
const { register, login } = require("../../../../server/controller/user");


describe("User controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // register
  // =========================
  describe("register", () => {
    test("should create a user and return 201", async () => {
      req.body = {
        email: "test@test.com",
        password: "1234"
      };

      const mockResult = { id: 1, email: "test@test.com" };

      User.create.mockResolvedValue(mockResult);

      await register(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockResult);
    });

    test("should return 400 if creation fails", async () => {
      req.body = { email: "bad@test.com" };

      User.create.mockRejectedValue(new Error("Validation error"));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation error"
      });
    });
  });

  // =========================
  // login
  // =========================
  describe("login", () => {
    test("should return user if login successful", async () => {
      req.body = { email: "test@test.com" };

      const mockUser = { id: 1, email: "test@test.com" };

      User.getOneByEmail.mockResolvedValue(mockUser);

      await login(req, res);

      expect(User.getOneByEmail).toHaveBeenCalledWith("test@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test("should return 401 if user not found", async () => {
      req.body = { email: "missing@test.com" };

      User.getOneByEmail.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "No user with this email"
      });
    });

    test("should return 401 if database throws error", async () => {
      req.body = { email: "error@test.com" };

      User.getOneByEmail.mockRejectedValue(new Error("DB error"));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "DB error"
      });
    });
  });
});