const db = require("../../../database/connect");
const HomePageEvents = require("../../../models/HomePageEvents");

jest.mock("../../../database/connect");

describe("HomePageEvents Model", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── getNewEvent ───────────────────────────────────────────────────────────

    describe("getNewEvent", () => {
        it("calls db.query with the user email", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.getNewEvent("alice@test.com");
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(expect.any(String), [
                "alice@test.com",
            ]);
        });

        it("returns the most recent unresponsive event row", async () => {
            const mockRow = {
                id: 1,
                title: "Morning Run",
                registration_id: 5,
                status: "unresponsive",
            };
            db.query.mockResolvedValue({ rows: [mockRow] });

            const result = await HomePageEvents.getNewEvent("alice@test.com");
            expect(result).toEqual(mockRow);
        });

        it("returns the string 'No New Events!' when there are no results", async () => {
            db.query.mockResolvedValue({ rows: [] });
            const result = await HomePageEvents.getNewEvent("alice@test.com");
            expect(result).toBe("No New Events!");
        });

        it("only queries for unresponsive registrations", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.getNewEvent("alice@test.com");
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/unresponsive/i);
        });

        it("limits results to 1", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.getNewEvent("alice@test.com");
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/LIMIT 1/i);
        });

    });

    // ─── joinEvent ─────────────────────────────────────────────────────────────

    describe("joinEvent", () => {
        it("calls db.query with the registration ID", async () => {
            db.query.mockResolvedValue({
                rows: [{ id: 5, status: "registered" }],
            });
            await HomePageEvents.joinEvent(5);
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(expect.any(String), [5]);
        });

        it("returns the updated registration row", async () => {
            const mockRow = {
                id: 5,
                status: "registered",
                user_email: "alice@test.com",
            };
            db.query.mockResolvedValue({ rows: [mockRow] });

            const result = await HomePageEvents.joinEvent(5);
            expect(result).toEqual(mockRow);
        });

        it("updates the status to 'registered'", async () => {
            db.query.mockResolvedValue({ rows: [{}] });
            await HomePageEvents.joinEvent(5);
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/registered/i);
            expect(sql).toMatch(/UPDATE event_registrations/i);
        });

        it("uses RETURNING * to return the updated row", async () => {
            db.query.mockResolvedValue({ rows: [{}] });
            await HomePageEvents.joinEvent(5);
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/RETURNING \*/i);
        });

    });

    // ─── nextEvent ─────────────────────────────────────────────────────────────

    describe("nextEvent", () => {
        it("calls db.query with the user email", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.nextEvent("bob@test.com");
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(expect.any(String), [
                "bob@test.com",
            ]);
        });

        it("returns the next upcoming registered event row", async () => {
            const mockRow = {
                id: 3,
                title: "Film Night Social",
                event_date: "22/04/2026",
                location: "Edinburgh",
                status: "registered",
            };
            db.query.mockResolvedValue({ rows: [mockRow] });

            const result = await HomePageEvents.nextEvent("bob@test.com");
            expect(result).toEqual(mockRow);
        });

        it("returns the string 'No Upcoming Events!' when there are no results", async () => {
            db.query.mockResolvedValue({ rows: [] });
            const result = await HomePageEvents.nextEvent("bob@test.com");
            expect(result).toBe("No Upcoming Events!");
        });

        it("only queries for registered status and future dates", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.nextEvent("bob@test.com");
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/registered/i);
            expect(sql).toMatch(/CURRENT_DATE/i);
        });

        it("orders results by event_date ascending and limits to 1", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.nextEvent("bob@test.com");
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/ORDER BY e\.event_date ASC/i);
            expect(sql).toMatch(/LIMIT 1/i);
        });

        it("formats the event date using TO_CHAR", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.nextEvent("bob@test.com");
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/TO_CHAR/i);
        });

    });

    // ─── recentPastEvent ───────────────────────────────────────────────────────

    describe("recentPastEvent", () => {
        it("calls db.query with the user email", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.recentPastEvent("charlie@test.com");
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(expect.any(String), [
                "charlie@test.com", // just once — pg reuses $1 automatically
            ]);
        });

        it("returns the most recent attended past event without feedback", async () => {
            const mockRow = {
                event_id: 2,
                title: "Board Games & Chill",
                event_date: "2026-04-13",
                location: "Manchester",
            };
            db.query.mockResolvedValue({ rows: [mockRow] });

            const result =
                await HomePageEvents.recentPastEvent("charlie@test.com");
            expect(result).toEqual(mockRow);
        });

        it("returns the string 'No Past Events To Review!' when there are no results", async () => {
            db.query.mockResolvedValue({ rows: [] });
            const result =
                await HomePageEvents.recentPastEvent("charlie@test.com");
            expect(result).toBe("No Past Events To Review!");
        });

        it("only queries for attended events before the current date", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.recentPastEvent("charlie@test.com");
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/attended/i);
            expect(sql).toMatch(/CURRENT_DATE/i);
        });

        it("excludes events that already have feedback via NOT EXISTS", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.recentPastEvent("charlie@test.com");
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/NOT EXISTS/i);
            expect(sql).toMatch(/feedback/i);
        });

        it("uses a CTE to find the latest event", async () => {
            db.query.mockResolvedValue({ rows: [] });
            await HomePageEvents.recentPastEvent("charlie@test.com");
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/WITH latest_event AS/i);
        });

    });

    // ─── feedback ──────────────────────────────────────────────────────────────

    describe("feedback", () => {
        const mockFeedbackInfo = {
            email: "alice@test.com",
            eventID: 1,
            rating: 5,
            comment: "Great event!",
        };

        it("calls db.query with all four feedback values", async () => {
            db.query.mockResolvedValue({ rows: [{}] });
            await HomePageEvents.feedback(mockFeedbackInfo);
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(expect.any(String), [
                "alice@test.com",
                1,
                5,
                "Great event!",
            ]);
        });

        it("returns the inserted or updated feedback row", async () => {
            const mockRow = {
                id: 10,
                user_email: "alice@test.com",
                event_id: 1,
                rating: 5,
                comment: "Great event!",
                wasInserted: true,
                wasUpdated: false,
            };
            db.query.mockResolvedValue({ rows: [mockRow] });

            const result = await HomePageEvents.feedback(mockFeedbackInfo);
            expect(result).toEqual(mockRow);
        });

        it("uses ON CONFLICT to upsert feedback", async () => {
            db.query.mockResolvedValue({ rows: [{}] });
            await HomePageEvents.feedback(mockFeedbackInfo);
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/ON CONFLICT/i);
            expect(sql).toMatch(/DO UPDATE SET/i);
        });


        it("inserts into the feedback table", async () => {
            db.query.mockResolvedValue({ rows: [{}] });
            await HomePageEvents.feedback(mockFeedbackInfo);
            const sql = db.query.mock.calls[0][0];
            expect(sql).toMatch(/INSERT INTO feedback/i);
        });

    });
});
