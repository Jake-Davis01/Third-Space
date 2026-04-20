jest.mock("../../../../server/models/User", () => ({
  create: jest.fn(),
  getOneByEmail: jest.fn(),
  update: jest.fn(),
}));

const User = require("../../../../server/models/User");
const { register, login, updateProfile, getProfile } = require("../../../../server/controller/user");

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── register ──────────────────────────────────────────────────────────────

  describe("register", () => {
    test("returns 201 with the created user", async () => {
      req.body = { first_name: "Alice", last_name: "Smith", email: "alice@test.com", password: "hash123" };
      const mockResult = { id: 1, email: "alice@test.com" };
      User.create.mockResolvedValue(mockResult);

      await register(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockResult);
    });

    test("returns 400 on error", async () => {
      User.create.mockRejectedValue(new Error("Validation error"));
      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation error" });
    });
  });

  // ─── login ─────────────────────────────────────────────────────────────────

  describe("login", () => {
    test("returns 200 with the user on success", async () => {
      req.body = { email: "alice@test.com" };
      const mockUser = { id: 1, email: "alice@test.com" };
      User.getOneByEmail.mockResolvedValue(mockUser);

      await login(req, res);

      expect(User.getOneByEmail).toHaveBeenCalledWith("alice@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test("returns 401 when no user is found", async () => {
      req.body = { email: "ghost@test.com" };
      User.getOneByEmail.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "No user with this email" });
    });

  });

  // ─── updateProfile ─────────────────────────────────────────────────────────

  describe("updateProfile", () => {
    test("returns 200 with the updated user", async () => {
      req.params.email = "alice@test.com";
      req.body = { office_location: "Edinburgh", meetup_preference: "hybrid", user_interests: ["Yoga"] };
      const mockResult = { id: 1, email: "alice@test.com", office_location: "Edinburgh" };
      User.update.mockResolvedValue(mockResult);

      await updateProfile(req, res);

      expect(User.update).toHaveBeenCalledWith("alice@test.com", req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

  });

  // ─── getProfile ────────────────────────────────────────────────────────────

  describe("getProfile", () => {
    test("returns 200 with the user profile", async () => {
      req.params.email = "alice@test.com";
      const mockUser = { id: 1, email: "alice@test.com", userInterests: ["Running"] };
      User.getOneByEmail.mockResolvedValue(mockUser);

      await getProfile(req, res);

      expect(User.getOneByEmail).toHaveBeenCalledWith("alice@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

  });
});