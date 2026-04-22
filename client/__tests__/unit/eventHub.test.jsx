import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EventHub from "../../src/components/eventHub.jsx";

const mockEvents = [
    {
        id: 1,
        title: "Morning Running Club",
        description: "A casual 5K run.",
        event_date: "2026-04-20",
        location: "London",
        categories: ["Running"],
    },
    {
        id: 2,
        title: "Film Night Social",
        description: "Weekly movie screening.",
        event_date: "2026-04-22",
        location: "Edinburgh",
        categories: ["Film"],
    },
];

beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockEvents,
    });
});

describe("EventHub", () => {

    it("shows loading text while fetching", () => {
        global.fetch = vi.fn(() => new Promise(() => {}));
        render(<EventHub />);
        expect(screen.getByText("Loading events…")).toBeInTheDocument();
    });

    it("shows empty message when no events returned", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [],
        });
        render(<EventHub />);
        await waitFor(() => {
            expect(screen.getByText("No upcoming events")).toBeInTheDocument();
        });
    });

    it("renders event cards after fetch", async () => {
        render(<EventHub />);
        await waitFor(() => {
            expect(screen.getByText("Morning Running Club")).toBeInTheDocument();
            expect(screen.getByText("Film Night Social")).toBeInTheDocument();
        });
    });

    it("renders date and location for each event", async () => {
        render(<EventHub />);
        await waitFor(() => {
            expect(screen.getByText(/2026-04-20/)).toBeInTheDocument();
            expect(screen.getByText(/London/)).toBeInTheDocument();
        });
    });

    it("renders Edit and Delete Event buttons for each card", async () => {
        render(<EventHub />);
        await waitFor(() => {
            expect(screen.getAllByText("Edit")).toHaveLength(2);
            expect(screen.getAllByText("Delete Event")).toHaveLength(2);
        });
    });


    it("shows confirmation prompt when Delete Event is clicked", async () => {
        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Delete Event"));
        fireEvent.click(screen.getAllByText("Delete Event")[0]);
        expect(screen.getByText("Are you sure?")).toBeInTheDocument();
        expect(screen.getByText("Yes, delete")).toBeInTheDocument();
    });

    it("cancels delete and restores buttons when Cancel is clicked", async () => {
        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Delete Event"));
        fireEvent.click(screen.getAllByText("Delete Event")[0]);
        fireEvent.click(screen.getByText("Cancel"));
        await waitFor(() => {
            expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
            expect(screen.getAllByText("Delete Event")).toHaveLength(2);
        });
    });

    it("removes event card after confirmed delete", async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => mockEvents })
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            .mockResolvedValue({ ok: true, json: async () => [mockEvents[1]] });

        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Delete Event"));
        fireEvent.click(screen.getAllByText("Delete Event")[0]);
        fireEvent.click(screen.getByText("Yes, delete"));

        await waitFor(() => {
            expect(screen.queryByText("Morning Running Club")).not.toBeInTheDocument();
            expect(screen.getByText("Film Night Social")).toBeInTheDocument();
        });
    });

    it("calls DELETE /api/events/:id with correct id", async () => {
        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Delete Event"));
        fireEvent.click(screen.getAllByText("Delete Event")[0]);
        fireEvent.click(screen.getByText("Yes, delete"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:3000/api/events/1",
                { method: "DELETE" }
            );
        });
    });

    it("opens edit modal when Edit is clicked", async () => {
        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Edit"));
        fireEvent.click(screen.getAllByText("Edit")[0]);
        expect(screen.getByText("Edit Event")).toBeInTheDocument();
    });

    it("pre-fills modal with event title and description", async () => {
        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Edit"));
        fireEvent.click(screen.getAllByText("Edit")[0]);
        expect(screen.getByDisplayValue("Morning Running Club")).toBeInTheDocument();
        expect(screen.getByDisplayValue("A casual 5K run.")).toBeInTheDocument();
    });

    it("pre-fills modal with event location", async () => {
        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Edit"));
        fireEvent.click(screen.getAllByText("Edit")[0]);
        expect(screen.getByDisplayValue("London")).toBeInTheDocument();
    });

    it("closes modal when Cancel is clicked", async () => {
        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Edit"));
        fireEvent.click(screen.getAllByText("Edit")[0]);
        expect(screen.getByText("Edit Event")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Cancel"));
        await waitFor(() => {
            expect(screen.queryByText("Edit Event")).not.toBeInTheDocument();
        });
    });

    it("updates title field when typed into", async () => {
        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Edit"));
        fireEvent.click(screen.getAllByText("Edit")[0]);
        const titleInput = screen.getByDisplayValue("Morning Running Club");
        fireEvent.change(titleInput, { target: { name: "title", value: "Evening Running Club" } });
        expect(screen.getByDisplayValue("Evening Running Club")).toBeInTheDocument();
    });

    it("calls PATCH /api/events/:id on save", async () => {
        const updatedEvent = { ...mockEvents[0], title: "Evening Running Club" };
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => mockEvents })
            .mockResolvedValueOnce({ ok: true, json: async () => updatedEvent })
            .mockResolvedValue({ ok: true, json: async () => [updatedEvent, mockEvents[1]] });

        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Edit"));
        fireEvent.click(screen.getAllByText("Edit")[0]);
        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:3000/api/events/1",
                expect.objectContaining({ method: "PATCH" })
            );
        });
    });

    it("shows Saved! on the button after successful save", async () => {
        const updatedEvent = { ...mockEvents[0], title: "Evening Running Club" };
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => mockEvents })
            .mockResolvedValueOnce({ ok: true, json: async () => updatedEvent })
            .mockResolvedValue({ ok: true, json: async () => [updatedEvent, mockEvents[1]] });

        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Edit"));
        fireEvent.click(screen.getAllByText("Edit")[0]);
        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("Saved!")).toBeInTheDocument();
        });
    });

    it("updates the card title after a successful edit", async () => {
        const updatedEvent = { ...mockEvents[0], title: "Evening Running Club" };
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => mockEvents })
            .mockResolvedValueOnce({ ok: true, json: async () => updatedEvent })
            .mockResolvedValue({ ok: true, json: async () => [updatedEvent, mockEvents[1]] });

        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Edit"));
        fireEvent.click(screen.getAllByText("Edit")[0]);
        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("Evening Running Club")).toBeInTheDocument();
        }, { timeout: 2000 });
    });

    it("shows error message when save fails", async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => mockEvents })
            .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
            .mockResolvedValue({ ok: true, json: async () => mockEvents });

        render(<EventHub />);
        await waitFor(() => screen.getAllByText("Edit"));
        fireEvent.click(screen.getAllByText("Edit")[0]);
        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("Could not save changes. Please try again.")).toBeInTheDocument();
        });
    });


    it("handles fetch error  and stops loading", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
        render(<EventHub />);
        await waitFor(() => {
            expect(screen.queryByText("Loading events…")).not.toBeInTheDocument();
        });
    });

    it("handles delete fetch error ", async () => {
    global.fetch = vi.fn()
        .mockResolvedValueOnce({ ok: true, json: async () => mockEvents })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValue({ ok: true, json: async () => mockEvents });

    render(<EventHub />);
    await waitFor(() => screen.getAllByText("Delete Event"));
    fireEvent.click(screen.getAllByText("Delete Event")[0]);
    fireEvent.click(screen.getByText("Yes, delete"));

    await waitFor(() => {
        // both events should still be there since delete failed
        expect(screen.getByText("Morning Running Club")).toBeInTheDocument();
        expect(screen.getByText("Film Night Social")).toBeInTheDocument();
    });
});
});