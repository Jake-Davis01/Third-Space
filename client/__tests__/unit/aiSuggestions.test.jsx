import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Aisuggestions from "../../src/components/Aisuggestions.jsx";

// ── Mock data ────────────────────────────────────────────────────────────────

const mockSuggestions = {
    topSuggestions: [
        {
            id: "1",
            title: "Morning Running Club",
            description: "A casual 5K run.",
            interested_count: 12,
            categories: ["Running"],
            category_name: "Running",
            best_location: "London",
        },
        {
            id: "2",
            title: "Film Night Social",
            description: "Weekly movie screening.",
            interested_count: 8,
            categories: ["Film"],
            category_name: "Film",
            best_location: "Manchester",
        },
        {
            id: "3",
            title: "Board Games & Chill",
            description: "Bring your favourite board game.",
            interested_count: 6,
            categories: ["Board games"],
            category_name: "Board games",
            best_location: "Edinburgh",
        },
    ],
    nicheSuggestion: {
        id: "4",
        title: "Chess Club",
        description: "Friendly chess for all levels.",
        interested_count: 4,
        categories: ["Chess"],
        category_name: "Chess",
        best_location: "Birmingham",
    },
};

const mockInterestedCount = { interested_count: 10 };

const mockValidatedIdea = {
    title: "Yoga Session",
    description: "A relaxing yoga session for all levels.",
    verdict: "good idea",
    confidence: "high",
    category_name: "Yoga",
    categories: ["Yoga"],
    interested_count: 7,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

async function openSchedulingModal(index = 0) {
    await waitFor(() => screen.getAllByText("Create"));
    fireEvent.click(screen.getAllByText("Create")[index]);
    await waitFor(() => screen.getByText("Event Title"));
}

async function openGeneratorModal() {
    const textarea = screen.getByPlaceholderText(/Enter your idea/i);
    fireEvent.change(textarea, { target: { value: "Yoga session" } });
    fireEvent.click(screen.getByText("Generate"));
    await waitFor(() => screen.getByText("Generate Event Idea"));
}

async function generateIdea() {
    await openGeneratorModal();
    fireEvent.click(screen.getByText("Generate Idea"));
    await waitFor(() => screen.getByText("Yoga Session"));
}

function fillRequiredFields() {
    const dateInput = document.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: "2026-06-01" } });

    const allSelects = screen.getAllByRole("combobox");

    const timeSelect = allSelects.find(el =>
        Array.from(el.options).some(o => o.value === "09:00")
    );
    fireEvent.change(timeSelect, { target: { value: "09:00" } });

    const locationSelect = allSelects.find(el =>
        Array.from(el.options).some(o => o.value === "London")
    );
    fireEvent.change(locationSelect, { target: { value: "London" } });

    const primaryCategorySelect = allSelects.find(el =>
        Array.from(el.options).some(o => o.value === "Running")
    );
    if (primaryCategorySelect) {
        fireEvent.change(primaryCategorySelect, { target: { value: "Running" } });
    }

    const textarea = screen.getByPlaceholderText(/Write a message/i);
    fireEvent.change(textarea, { target: { value: "Come join us!" } });
}

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("userEmail", "test@test.com");

    global.fetch = vi.fn((url) => {
        if (url.includes("/ai/suggestions")) {
            return Promise.resolve({ ok: true, json: async () => mockSuggestions });
        }
        if (url.includes("/ai/interested-count")) {
            return Promise.resolve({ ok: true, json: async () => mockInterestedCount });
        }
        if (url.includes("/ai/validate-idea")) {
            return Promise.resolve({ ok: true, json: async () => mockValidatedIdea });
        }
        if (url.includes("/api/events")) {
            return Promise.resolve({ ok: true, json: async () => ({ id: 99, title: "Test Event" }) });
        }
        return Promise.resolve({ ok: true, json: async () => ({}) });
    });
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("Aisuggestions", () => {

    // ── Loading & render ─────────────────────────────────────────────────────

    it("renders the page heading", () => {
        render(<Aisuggestions />);
        expect(screen.getByText(/Your Next Event Is A Few Clicks Away/i)).toBeInTheDocument();
    });

    it("shows loading indicator while fetching suggestions", () => {
        global.fetch = vi.fn(() => new Promise(() => {}));
        render(<Aisuggestions />);
        expect(screen.getByText(/Loading suggestions/i)).toBeInTheDocument();
    });

    it("renders top suggestions after fetch", async () => {
        render(<Aisuggestions />);
        await waitFor(() => {
            expect(screen.getByText("Morning Running Club")).toBeInTheDocument();
            expect(screen.getByText("Film Night Social")).toBeInTheDocument();
            expect(screen.getByText("Board Games & Chill")).toBeInTheDocument();
        });
    });

    it("renders niche suggestion after fetch", async () => {
        render(<Aisuggestions />);
        await waitFor(() => {
            expect(screen.getByText("Chess Club")).toBeInTheDocument();
        });
    });

    it("shows empty state when no top suggestions returned", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ topSuggestions: [], nicheSuggestion: null }),
        });
        render(<Aisuggestions />);
        await waitFor(() => {
            expect(screen.getByText(/No suggestions available yet/i)).toBeInTheDocument();
        });
    });

    it("shows no event available when nicheSuggestion is null", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                topSuggestions: mockSuggestions.topSuggestions,
                nicheSuggestion: null,
            }),
        });
        render(<Aisuggestions />);
        await waitFor(() => {
            expect(screen.getByText(/No event available/i)).toBeInTheDocument();
        });
    });

    it("renders Create buttons for each top suggestion", async () => {
        render(<Aisuggestions />);
        await waitFor(() => {
            expect(screen.getAllByText("Create").length).toBeGreaterThanOrEqual(3);
        });
    });

    it("shows interested count for suggestions", async () => {
        render(<Aisuggestions />);
        await waitFor(() => {
            expect(screen.getByText(/Interested members: 12/i)).toBeInTheDocument();
        });
    });

    it("shows estimated cost for suggestions", async () => {
        render(<Aisuggestions />);
        await waitFor(() => {
            expect(screen.getAllByText(/Estimated cost/i).length).toBeGreaterThan(0);
        });
    });

    // ── Scheduling modal ─────────────────────────────────────────────────────

    it("opens scheduling modal when Create is clicked", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        expect(screen.getByText("Event Title")).toBeInTheDocument();
    });

    it("pre-fills event title in modal", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        expect(screen.getByDisplayValue("Morning Running Club")).toBeInTheDocument();
    });

    it("shows cancel confirm when X is clicked in modal", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        fireEvent.click(screen.getByText("✕"));
        expect(screen.getByText(/Are you sure you want to cancel/i)).toBeInTheDocument();
    });

    it("stays in modal when No is clicked on cancel confirm", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        fireEvent.click(screen.getByText("✕"));
        fireEvent.click(screen.getByText("No"));
        expect(screen.getByText("Event Title")).toBeInTheDocument();
    });

    it("closes modal when Yes is clicked on cancel confirm", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        fireEvent.click(screen.getByText("✕"));
        fireEvent.click(screen.getByText("Yes"));
        await waitFor(() => {
            expect(screen.queryByText("Event Title")).not.toBeInTheDocument();
        });
    });

    it("allows editing the event title in modal", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        const titleInput = screen.getByDisplayValue("Morning Running Club");
        fireEvent.change(titleInput, { target: { value: "Evening Running Club" } });
        expect(screen.getByDisplayValue("Evening Running Club")).toBeInTheDocument();
    });

    it("Schedule Event button is disabled when fields are empty", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        expect(screen.getByText("Schedule Event")).toBeDisabled();
    });

    it("shows location dropdown in modal", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        expect(screen.getByText("Select Location")).toBeInTheDocument();
    });

    it("shows category selector in modal", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        expect(screen.getByText("Select Category / Categories")).toBeInTheDocument();
    });

    it("toggles a category tag on click to deselect", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        const runningTag = screen.getByRole("button", { name: "Running" });
        fireEvent.click(runningTag);
        expect(runningTag).not.toHaveClass("aisuggestions__tagSelected");
    });

    it("toggles a category tag on click to select", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        const cookingTag = screen.getByRole("button", { name: "Cooking" });
        fireEvent.click(cookingTag);
        expect(cookingTag).toHaveClass("aisuggestions__tagSelected");
    });

    it("shows no budget required checkbox in modal", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("checking no budget required checkbox marks it as checked", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });

    it("selecting Fully remote location shows zero cost message", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        const allSelects = screen.getAllByRole("combobox");
        const locationSelect = allSelects.find(el =>
            Array.from(el.options).some(o => o.value === "Fully remote")
        );
        fireEvent.change(locationSelect, { target: { value: "Fully remote" } });
        await waitFor(() => {
            expect(screen.getByText(/little to no organiser spend/i)).toBeInTheDocument();
        });
    });

    it("selecting a location calls interested count endpoint", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        const allSelects = screen.getAllByRole("combobox");
        const locationSelect = allSelects.find(el =>
            Array.from(el.options).some(o => o.value === "London")
        );
        fireEvent.change(locationSelect, { target: { value: "London" } });
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/ai/interested-count?")
            );
        });
    });

    it("shows Suggest Real Venues button in modal", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        expect(screen.getByText(/Suggest Real Venues/i)).toBeInTheDocument();
    });

    it("shows invitation message textarea in modal", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        expect(screen.getByPlaceholderText(/Write a message/i)).toBeInTheDocument();
    });

    it("Schedule Event becomes enabled when all fields are filled", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        fillRequiredFields();
        await waitFor(() => {
            expect(screen.getByText("Schedule Event")).not.toBeDisabled();
        });
    });

    it("shows confirmation toast after successful event creation", async () => {
        render(<Aisuggestions />);
        await openSchedulingModal();
        fillRequiredFields();
        fireEvent.click(screen.getByText("Schedule Event"));
        await waitFor(() => {
            expect(screen.getByText(/Your event is now scheduled/i)).toBeInTheDocument();
        });
    });

    it("shows error message when event creation fails", async () => {
        global.fetch = vi.fn((url) => {
            if (url.includes("/ai/suggestions")) {
                return Promise.resolve({ ok: true, json: async () => mockSuggestions });
            }
            if (url.includes("/ai/interested-count")) {
                return Promise.resolve({ ok: true, json: async () => mockInterestedCount });
            }
            if (url.includes("/api/events")) {
                return Promise.resolve({ ok: false, text: async () => "Server error" });
            }
            return Promise.resolve({ ok: true, json: async () => ({}) });
        });

        render(<Aisuggestions />);
        await openSchedulingModal();
        fillRequiredFields();
        fireEvent.click(screen.getByText("Schedule Event"));
        await waitFor(() => {
            expect(screen.getByText(/Failed to create event/i)).toBeInTheDocument();
        });
    });

    // ── Idea generator ───────────────────────────────────────────────────────

    it("renders the idea generator textarea", () => {
        render(<Aisuggestions />);
        expect(screen.getByPlaceholderText(/Enter your idea/i)).toBeInTheDocument();
    });

    it("renders the Generate button", () => {
        render(<Aisuggestions />);
        expect(screen.getByText("Generate")).toBeInTheDocument();
    });

    it("opens generator modal when Generate is clicked with input", async () => {
        render(<Aisuggestions />);
        await openGeneratorModal();
        expect(screen.getByText("Generate Event Idea")).toBeInTheDocument();
    });

    it("does not open generator modal when input is empty", async () => {
        render(<Aisuggestions />);
        fireEvent.click(screen.getByText("Generate"));
        await waitFor(() => {
            expect(screen.queryByText("Generate Event Idea")).not.toBeInTheDocument();
        });
    });

    it("shows generated idea title after Generate Idea is clicked", async () => {
        render(<Aisuggestions />);
        await generateIdea();
        expect(screen.getByText("Yoga Session")).toBeInTheDocument();
    });

    it("shows good idea verdict after generation", async () => {
        render(<Aisuggestions />);
        await generateIdea();
        expect(screen.getByText("good idea")).toBeInTheDocument();
    });

    it("shows high confidence after generation", async () => {
        render(<Aisuggestions />);
        await generateIdea();
        expect(screen.getByText("high")).toBeInTheDocument();
    });

    it("shows interested count in generated idea", async () => {
        render(<Aisuggestions />);
        await generateIdea();
        expect(screen.getAllByText(/Interested/i).length).toBeGreaterThan(0);
    });

    it("shows Use This Idea button after generation", async () => {
        render(<Aisuggestions />);
        await generateIdea();
        expect(screen.getByText("Use This Idea")).toBeInTheDocument();
    });

    it("opens scheduling modal when Use This Idea is clicked", async () => {
        render(<Aisuggestions />);
        await generateIdea();
        fireEvent.click(screen.getByText("Use This Idea"));
        await waitFor(() => {
            expect(screen.getByText("Event Title")).toBeInTheDocument();
            expect(screen.getByDisplayValue("Yoga Session")).toBeInTheDocument();
        });
    });

    it("shows cancel confirm in generator modal when X is clicked", async () => {
        render(<Aisuggestions />);
        await openGeneratorModal();
        fireEvent.click(screen.getByText("✕"));
        expect(screen.getByText(/Are you sure you want to discard/i)).toBeInTheDocument();
    });

    it("closes generator modal when Yes is clicked on discard confirm", async () => {
        render(<Aisuggestions />);
        await openGeneratorModal();
        fireEvent.click(screen.getByText("✕"));
        fireEvent.click(screen.getByText("Yes"));
        await waitFor(() => {
            expect(screen.queryByText("Generate Event Idea")).not.toBeInTheDocument();
        });
    });

    it("stays in generator modal when No is clicked on discard confirm", async () => {
        render(<Aisuggestions />);
        await openGeneratorModal();
        fireEvent.click(screen.getByText("✕"));
        fireEvent.click(screen.getByText("No"));
        expect(screen.getByText("Generate Event Idea")).toBeInTheDocument();
    });

    it("shows maybe verdict styling for maybe result", async () => {
        global.fetch = vi.fn((url) => {
            if (url.includes("/ai/suggestions")) {
                return Promise.resolve({ ok: true, json: async () => mockSuggestions });
            }
            if (url.includes("/ai/validate-idea")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ ...mockValidatedIdea, verdict: "maybe", confidence: "medium" }),
                });
            }
            return Promise.resolve({ ok: true, json: async () => ({}) });
        });
        render(<Aisuggestions />);
        await generateIdea();
        expect(screen.getByText("maybe")).toBeInTheDocument();
        expect(screen.getByText("medium")).toBeInTheDocument();
    });

    it("shows not recommended verdict styling", async () => {
        global.fetch = vi.fn((url) => {
            if (url.includes("/ai/suggestions")) {
                return Promise.resolve({ ok: true, json: async () => mockSuggestions });
            }
            if (url.includes("/ai/validate-idea")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ ...mockValidatedIdea, verdict: "not recommended", confidence: "low" }),
                });
            }
            return Promise.resolve({ ok: true, json: async () => ({}) });
        });
        render(<Aisuggestions />);
        await generateIdea();
        expect(screen.getByText("not recommended")).toBeInTheDocument();
        expect(screen.getByText("low")).toBeInTheDocument();
    });

    // ── API error handling ───────────────────────────────────────────────────

    it("handles AI suggestions fetch error gracefully", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
        render(<Aisuggestions />);
        await waitFor(() => {
            expect(screen.queryByText(/Loading suggestions/i)).not.toBeInTheDocument();
        });
    });

    it("handles AI suggestions non-ok response gracefully", async () => {
        global.fetch = vi.fn((url) => {
            if (url.includes("/ai/suggestions")) {
                return Promise.resolve({ ok: false, text: async () => "Internal Server Error" });
            }
            return Promise.resolve({ ok: true, json: async () => ({}) });
        });
        render(<Aisuggestions />);
        await waitFor(() => {
            expect(screen.queryByText(/Loading suggestions/i)).not.toBeInTheDocument();
        });
    });

    it("handles validate-idea fetch error gracefully", async () => {
        global.fetch = vi.fn((url) => {
            if (url.includes("/ai/suggestions")) {
                return Promise.resolve({ ok: true, json: async () => mockSuggestions });
            }
            if (url.includes("/ai/validate-idea")) {
                return Promise.reject(new Error("Network error"));
            }
            return Promise.resolve({ ok: true, json: async () => ({}) });
        });

        render(<Aisuggestions />);
        await openGeneratorModal();
        fireEvent.click(screen.getByText("Generate Idea"));

        await waitFor(() => {
            expect(screen.getByText(/We could not assess this idea/i)).toBeInTheDocument();
        });
    });

    it("handles interested count fetch error gracefully", async () => {
        global.fetch = vi.fn((url) => {
            if (url.includes("/ai/suggestions")) {
                return Promise.resolve({ ok: true, json: async () => mockSuggestions });
            }
            if (url.includes("/ai/interested-count")) {
                return Promise.reject(new Error("Network error"));
            }
            return Promise.resolve({ ok: true, json: async () => ({}) });
        });

        render(<Aisuggestions />);
        await openSchedulingModal();
        const allSelects = screen.getAllByRole("combobox");
        const locationSelect = allSelects.find(el =>
            Array.from(el.options).some(o => o.value === "London")
        );
        fireEvent.change(locationSelect, { target: { value: "London" } });

        await waitFor(() => {
            expect(screen.queryByText(/Updating/i)).not.toBeInTheDocument();
        });
    });
});