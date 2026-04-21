import { useEffect, useState } from "react";
import "../css/Aisuggestions.css";

function Aisuggestions() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editableTitle, setEditableTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showErrorHint, setShowErrorHint] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popularEvents, setPopularEvents] = useState([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);

  const [generatorInput, setGeneratorInput] = useState("");
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [showGeneratorCancelConfirm, setShowGeneratorCancelConfirm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const categoryOptions = [
    "Running",
    "Film",
    "Gaming",
    "Cooking",
    "Board games",
    "Hiking",
    "Photography",
    "Reading",
    "Yoga",
    "Cycling",
    "Music",
    "Travel",
    "Chess",
    "Volunteering",
  ];

  useEffect(() => {
    const fetchAiSuggestions = async () => {
      try {
        setIsLoadingPopular(true);

        const response = await fetch("http://localhost:3000/api/ai/suggestions");

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("AI SUGGESTIONS FROM API:", data);

        const combinedSuggestions = [
          ...(Array.isArray(data.topSuggestions) ? data.topSuggestions : []),
          ...(data.nicheSuggestion ? [data.nicheSuggestion] : []),
        ];

        setPopularEvents(combinedSuggestions);
      } catch (err) {
        console.error("Error fetching AI suggestions:", err);
        setPopularEvents([]);
      } finally {
        setIsLoadingPopular(false);
      }
    };

    fetchAiSuggestions();
  }, []);

  const resetModalState = () => {
    setSelectedEvent(null);
    setEditableTitle("");
    setDate("");
    setLocation("");
    setCategories([]);
    setPrimaryCategory("");
    setMessage("");
    setShowCancelConfirm(false);
    setShowErrorHint(false);
    setSubmitError("");
    setIsSubmitting(false);
  };

  const resetGeneratorState = () => {
    setGeneratedIdea(null);
    setShowGeneratorCancelConfirm(false);
    setIsGenerating(false);
    setGeneratorInput("");
  };

  const handleCreateClick = (
    title,
    description,
    defaultCategories = [],
    interestedCount = 0
  ) => {
    setSelectedEvent({ title, description, interested_count: interestedCount });
    setEditableTitle(title);
    setCategories(defaultCategories);
    setPrimaryCategory(defaultCategories[0] || "");
    setShowModal(true);
    setShowCancelConfirm(false);
    setShowErrorHint(false);
    setSubmitError("");
  };

  const handleCloseClick = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowModal(false);
    resetModalState();
  };

  const stayInModal = () => {
    setShowCancelConfirm(false);
  };

  const toggleCategory = (category) => {
    if (categories.includes(category)) {
      const updatedCategories = categories.filter((item) => item !== category);
      setCategories(updatedCategories);

      if (primaryCategory === category) {
        setPrimaryCategory("");
      }
    } else {
      setCategories([...categories, category]);
    }
  };

  const handleSubmit = async () => {
    console.log("SUBMIT CLICKED");

    if (!editableTitle.trim() || !date || !location || categories.length === 0 || !primaryCategory || !message.trim()) {
      setShowErrorHint(true);
      setTimeout(() => setShowErrorHint(false), 1200);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const userEmail = localStorage.getItem("userEmail");

      console.log("userEmail:", userEmail);
      console.log("primary category:", primaryCategory);
      console.log("all categories:", categories);

      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editableTitle.trim(),
          description: selectedEvent.description,
          event_date: date,
          location,
          primary_category_name: primaryCategory,
          categories,
          user_email: userEmail,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      console.log("Event created:", data);

      setShowModal(false);
      resetModalState();

      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 4000);
    } catch (err) {
      console.error("Error creating event:", err);
      setSubmitError("Failed to create event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    editableTitle.trim() &&
    date &&
    location &&
    categories.length > 0 &&
    primaryCategory &&
    message.trim() &&
    !isSubmitting;

  const handleGenerateClick = async () => {
    if (!generatorInput.trim()) return;

    try {
      setShowGeneratorModal(true);
      setIsGenerating(true);
      setGeneratedIdea(null);

      const response = await fetch("http://localhost:3000/api/ai/validate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: generatorInput.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("AI IDEA RESPONSE:", data);

      setGeneratedIdea(data);
    } catch (err) {
      console.error("Error validating idea:", err);
      setGeneratedIdea({
        title: generatorInput,
        description: `We could not assess this idea right now. ${err.message}`,
        verdict: "maybe",
        confidence: "low",
        category_name: "",
        categories: [],
        interested_count: 0,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateIdea = async () => {
    if (!generatorInput.trim()) return;

    try {
      setIsGenerating(true);
      setGeneratedIdea(null);

      const response = await fetch("http://localhost:3000/api/ai/validate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: generatorInput.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("AI IDEA RESPONSE:", data);

      setGeneratedIdea(data);
    } catch (err) {
      console.error("Error validating idea:", err);
      setGeneratedIdea({
        title: generatorInput,
        description: `We could not assess this idea right now. ${err.message}`,
        verdict: "maybe",
        confidence: "low",
        category_name: "",
        categories: [],
        interested_count: 0,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const useGeneratedIdea = () => {
    const ideaToUse = generatedIdea;

    setShowGeneratorModal(false);
    resetGeneratorState();

    setSelectedEvent({
      title: ideaToUse?.title || generatorInput,
      description: ideaToUse?.description || "",
      interested_count: Number(ideaToUse?.interested_count) || 0,
    });
    setEditableTitle(ideaToUse?.title || generatorInput);
    setCategories(ideaToUse?.categories || []);
    setPrimaryCategory(ideaToUse?.categories?.[0] || "");
    setShowModal(true);
    setSubmitError("");
  };

  const closeGeneratorConfirm = () => {
    setShowGeneratorCancelConfirm(true);
  };

  const confirmGeneratorCancel = () => {
    setShowGeneratorModal(false);
    resetGeneratorState();
  };

  const stayGenerator = () => {
    setShowGeneratorCancelConfirm(false);
  };

  const topSuggestions = popularEvents.slice(0, 3);
  const nicheSuggestion = popularEvents[3];

  return (
    <div className="aisuggestions__container">
      <div className="aisuggestions__header">
        <h1 className="aisuggestions__title">
          Your Next Event Is A Few Clicks Away!
        </h1>
        <p className="aisuggestions__subtitle">
          Discover and generate ideas tailored to your interests
        </p>
      </div>

      <div className="aisuggestions__content">
        <div className="aisuggestions__sectionBox">
          <h3 className="aisuggestions__sectionTitle">Top Suggestions</h3>

          {isLoadingPopular ? (
            <p className="aisuggestions__cardText">Loading suggestions...</p>
          ) : topSuggestions.length > 0 ? (
            topSuggestions.map((event, index) => (
              <div className="aisuggestions__card" key={`${event.title}-${index}`}>
                <div className="aisuggestions__cardHeader">
                  <div className="aisuggestions__cardBody">
                    <strong className="aisuggestions__cardTitle">{event.title}</strong>
                    <p className="aisuggestions__cardText">
                      {event.description} Cost: {event.estimated_cost}. Best location: {event.best_location}.
                    </p>
                  </div>
                  <button
                    className="aisuggestions__cardButton"
                    onClick={() =>
                      handleCreateClick(
                        event.title,
                        `${event.description} Cost: ${event.estimated_cost}. Best location: ${event.best_location}.`,
                        event.categories && event.categories.length > 0
                          ? event.categories
                          : event.category_name
                          ? [event.category_name]
                          : [],
                        Number(event.interested_count) || 0
                      )
                    }
                  >
                    Create
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="aisuggestions__cardText">No suggestions available yet.</p>
          )}
        </div>
      </div>

      <div className="aisuggestions__section">
        <div className="aisuggestions__sectionBox">
          <h3 className="aisuggestions__sectionTitle">
            Let's Try Something Different
          </h3>

          {isLoadingPopular ? (
            <p className="aisuggestions__cardText">Loading event...</p>
          ) : nicheSuggestion ? (
            <div className="aisuggestions__nicheCard">
              <div className="aisuggestions__cardHeader">
                <div className="aisuggestions__cardBody">
                  <strong className="aisuggestions__cardTitle">
                    {nicheSuggestion.title}
                  </strong>
                  <p className="aisuggestions__cardText">
                    {nicheSuggestion.description} Cost: {nicheSuggestion.estimated_cost}. Best location: {nicheSuggestion.best_location}.
                  </p>
                </div>
                <button
                  className="aisuggestions__cardButton"
                  onClick={() =>
                    handleCreateClick(
                      nicheSuggestion.title,
                      `${nicheSuggestion.description} Cost: ${nicheSuggestion.estimated_cost}. Best location: ${nicheSuggestion.best_location}.`,
                      nicheSuggestion.categories && nicheSuggestion.categories.length > 0
                        ? nicheSuggestion.categories
                        : nicheSuggestion.category_name
                        ? [nicheSuggestion.category_name]
                        : [],
                      Number(nicheSuggestion.interested_count) || 0
                    )
                  }
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <div className="aisuggestions__nicheCard">
              <div className="aisuggestions__cardHeader">
                <div className="aisuggestions__cardBody">
                  <strong className="aisuggestions__cardTitle">
                    No event available
                  </strong>
                  <p className="aisuggestions__cardText">
                    Check back later for more suggestions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="aisuggestions__section">
        <div className="aisuggestions__sectionBox">
          <h3 className="aisuggestions__sectionTitle">
            Have Something In Mind?
          </h3>

          <textarea
            className="aisuggestions__textarea"
            placeholder="Enter your idea, budget and estimated head count"
            value={generatorInput}
            onChange={(e) => setGeneratorInput(e.target.value)}
          />

          <button
            className="aisuggestions__generateButton"
            onClick={handleGenerateClick}
          >
            Generate
          </button>
        </div>
      </div>

      {showGeneratorModal && (
        <div className="aisuggestions__modalOverlay">
          <div className="aisuggestions__modal">
            <button
              className="aisuggestions__closeBtn"
              onClick={closeGeneratorConfirm}
              type="button"
            >
              ✕
            </button>

            {!showGeneratorCancelConfirm ? (
              <>
                <h2>Generate Event Idea</h2>

                <textarea
                  className="aisuggestions__textareaModal"
                  value={generatorInput}
                  onChange={(e) => setGeneratorInput(e.target.value)}
                />

                <button
                  className="aisuggestions__generateButton"
                  onClick={handleGenerateIdea}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Idea"}
                </button>

                {generatedIdea && (
                  <div className="aisuggestions__generatedBox">
                    <strong>{generatedIdea.title}</strong>
                    <p>{generatedIdea.description}</p>
                    <p>
                      <strong>Interested Members:</strong>{" "}
                      {Number(generatedIdea.interested_count) || 0}
                    </p>
                    <p>
                      <strong>Verdict:</strong> {generatedIdea.verdict} |{" "}
                      <strong>Confidence:</strong> {generatedIdea.confidence}
                    </p>

                    <button
                      className="aisuggestions__generateButton"
                      onClick={useGeneratedIdea}
                    >
                      Use This Idea
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="aisuggestions__cancelConfirm">
                <p>Are you sure you want to discard this idea?</p>

                <div className="aisuggestions__cancelButtons">
                  <button onClick={confirmGeneratorCancel}>Yes</button>
                  <button onClick={stayGenerator}>No</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="aisuggestions__modalOverlay">
          <div className="aisuggestions__modal">
            <button
              className="aisuggestions__closeBtn"
              onClick={handleCloseClick}
              type="button"
            >
              ✕
            </button>

            {!showCancelConfirm ? (
              <>
                <div
                  className={`aisuggestions__formGroup ${
                    showErrorHint && !editableTitle.trim() ? "aisuggestions__error" : ""
                  }`}
                >
                  <label className="aisuggestions__label">Event Title</label>

                  <p className="aisuggestions__helperText">
                    You can edit the event heading before saving
                  </p>

                  <input
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    className="aisuggestions__input"
                    placeholder="Enter event title"
                  />
                </div>

                <p>{selectedEvent?.description}</p>

                <p>
                  <strong>Interested Members:</strong>{" "}
                  {selectedEvent?.interested_count ?? 0}
                </p>

                <div
                  className={`aisuggestions__formGroup ${
                    showErrorHint && !date ? "aisuggestions__error" : ""
                  }`}
                >
                  <label className="aisuggestions__label">
                    Select Event Date
                  </label>

                  <p className="aisuggestions__helperText">
                    Select the date for your event
                  </p>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    className="aisuggestions__input"
                  />
                </div>

                <div
                  className={`aisuggestions__formGroup ${
                    showErrorHint && !location ? "aisuggestions__error" : ""
                  }`}
                >
                  <label className="aisuggestions__label">
                    Select Location
                  </label>

                  <p className="aisuggestions__helperText">
                    Choose whether the event is remote or at an office location
                  </p>

                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="aisuggestions__input"
                  >
                    <option value="">Choose a location</option>
                    <option value="Fully remote">Fully remote</option>
                    <option value="London">London</option>
                    <option value="Edinburgh">Edinburgh</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Birmingham">Birmingham</option>
                  </select>
                </div>

                <div
                  className={`aisuggestions__formGroup ${
                    showErrorHint && categories.length === 0
                      ? "aisuggestions__error"
                      : ""
                  }`}
                >
                  <label className="aisuggestions__label">
                    Select Category / Categories
                  </label>

                  <p className="aisuggestions__helperText">
                    Pick one or more categories for this event.
                  </p>

                  <div className="aisuggestions__categoryBox">
                    <div className="aisuggestions__categories">
                      {categoryOptions.map((category) => (
                        <button
                          key={category}
                          type="button"
                          className={`aisuggestions__tag ${
                            categories.includes(category)
                              ? "aisuggestions__tagSelected"
                              : ""
                          }`}
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={`aisuggestions__formGroup ${
                    showErrorHint && !primaryCategory ? "aisuggestions__error" : ""
                  }`}
                >
                  <label className="aisuggestions__label">
                    Select Primary Category
                  </label>

                  <p className="aisuggestions__helperText">
                    Choose the main category that should be saved in the events table.
                  </p>

                  <select
                    value={primaryCategory}
                    onChange={(e) => setPrimaryCategory(e.target.value)}
                    className="aisuggestions__input"
                  >
                    <option value="">Choose a primary category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className={`aisuggestions__formGroup ${
                    showErrorHint && !message.trim() ? "aisuggestions__error" : ""
                  }`}
                >
                  <label className="aisuggestions__label">
                    Invitation Message
                  </label>

                  <p className="aisuggestions__helperText">
                    Add a short message to invite attendees and set the tone
                  </p>

                  <textarea
                    placeholder="Write a message for your invite..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="aisuggestions__textareaModal"
                  />
                </div>

                {submitError && (
                  <p
                    style={{
                      color: "crimson",
                      marginTop: "8px",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {submitError}
                  </p>
                )}

                <button
                  className="aisuggestions__generateButton"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Saving..." : "Schedule Event"}
                </button>
              </>
            ) : (
              <div className="aisuggestions__cancelConfirm">
                <p>Are you sure you want to cancel scheduling this event?</p>

                <div className="aisuggestions__cancelButtons">
                  <button onClick={confirmCancel}>Yes</button>
                  <button onClick={stayInModal}>No</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="aisuggestions__confirmation">
          Your event is now scheduled. Head to your events page to track RSVPs.
        </div>
      )}
    </div>
  );
}

export default Aisuggestions;