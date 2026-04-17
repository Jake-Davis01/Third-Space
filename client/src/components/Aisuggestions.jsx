import { useState } from "react";
import "../css/Aisuggestions.css";

function Aisuggestions() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showErrorHint, setShowErrorHint] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // generator states
  const [generatorInput, setGeneratorInput] = useState("");
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [showGeneratorCancelConfirm, setShowGeneratorCancelConfirm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const mockInterestedCount = 42;
  const today = new Date().toISOString().split("T")[0];

  const resetModalState = () => {
    setSelectedEvent(null);
    setDate("");
    setLocation("");
    setCategory("");
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

  const handleCreateClick = (title, description, category_name = "") => {
    setSelectedEvent({ title, description, category_name });
    setCategory(category_name || "");
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

  const handleSubmit = async () => {
    console.log("SUBMIT CLICKED");

    if (!date || !location || !category || !message.trim()) {
      setShowErrorHint(true);
      setTimeout(() => setShowErrorHint(false), 1200);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedEvent.title,
          description: selectedEvent.description,
          event_date: date,
          location: location,
          category_name: category,
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

  const canSubmit = date && location && category && message.trim() && !isSubmitting;

  const handleGenerateClick = () => {
    if (!generatorInput.trim()) return;

    setShowGeneratorModal(true);
    setIsGenerating(true);
    setGeneratedIdea(null);

    setTimeout(() => {
      setGeneratedIdea({
        title: "AI Suggested Event",
        description: `Based on your idea: "${generatorInput}", this event could bring people together in a fun, engaging and social way.`,
        category_name: "",
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handleGenerateIdea = () => {
    if (!generatorInput.trim()) return;

    setIsGenerating(true);
    setGeneratedIdea(null);

    setTimeout(() => {
      setGeneratedIdea({
        title: "AI Suggested Event",
        description: `Based on your idea: "${generatorInput}", this event could bring people together in a fun, engaging and social way.`,
        category_name: "",
      });
      setIsGenerating(false);
    }, 1500);
  };

  const useGeneratedIdea = () => {
    const ideaToUse = generatedIdea;

    setShowGeneratorModal(false);
    resetGeneratorState();

    setSelectedEvent(ideaToUse);
    setCategory(ideaToUse?.category_name || "");
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

          <div className="aisuggestions__card">
            <div className="aisuggestions__cardHeader">
              <div className="aisuggestions__cardBody">
                <strong className="aisuggestions__cardTitle">Book Club</strong>
                <p className="aisuggestions__cardText">
                  Those options are already baked in with this model...
                </p>
              </div>
              <button
                className="aisuggestions__cardButton"
                onClick={() =>
                  handleCreateClick(
                    "Book Club",
                    "Those options are already baked in with this model...",
                    "Reading"
                  )
                }
              >
                Create
              </button>
            </div>
          </div>

          <div className="aisuggestions__card">
            <div className="aisuggestions__cardHeader">
              <div className="aisuggestions__cardBody">
                <strong className="aisuggestions__cardTitle">Tech Talks</strong>
                <p className="aisuggestions__cardText">
                  Those options are already baked in with this model...
                </p>
              </div>
              <button
                className="aisuggestions__cardButton"
                onClick={() =>
                  handleCreateClick(
                    "Tech Talks",
                    "Those options are already baked in...",
                    ""
                  )
                }
              >
                Create
              </button>
            </div>
          </div>

          <div className="aisuggestions__card">
            <div className="aisuggestions__cardHeader">
              <div className="aisuggestions__cardBody">
                <strong className="aisuggestions__cardTitle">City Cycles</strong>
                <p className="aisuggestions__cardText">
                  Those options are already baked in with this model...
                </p>
              </div>
              <button
                className="aisuggestions__cardButton"
                onClick={() =>
                  handleCreateClick(
                    "City Cycles",
                    "Those options are already baked in...",
                    "Cycling"
                  )
                }
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="aisuggestions__section">
        <div className="aisuggestions__sectionBox">
          <h3 className="aisuggestions__sectionTitle">
            Let's Try Something Different
          </h3>

          <div className="aisuggestions__nicheCard">
            <div className="aisuggestions__cardHeader">
              <div className="aisuggestions__cardBody">
                <strong className="aisuggestions__cardTitle">
                  Silent Disco Picnic
                </strong>
                <p className="aisuggestions__cardText">
                  A relaxed outdoor picnic where everyone wears headphones...
                </p>
              </div>
              <button
                className="aisuggestions__cardButton"
                onClick={() =>
                  handleCreateClick(
                    "Silent Disco Picnic",
                    "A relaxed outdoor picnic where everyone wears headphones...",
                    "Music"
                  )
                }
              >
                Create
              </button>
            </div>
          </div>
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
            >
              ✕
            </button>

            {!showCancelConfirm ? (
              <>
                <h2>{selectedEvent?.title}</h2>
                <p>{selectedEvent?.description}</p>

                <p>
                  <strong>Interested Members:</strong> {mockInterestedCount}
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
                  </select>
                </div>

                <div
                  className={`aisuggestions__formGroup ${
                    showErrorHint && !category ? "aisuggestions__error" : ""
                  }`}
                >
                  <label className="aisuggestions__label">
                    Select Category
                  </label>

                  <p className="aisuggestions__helperText">
                    Choose the category that best fits this event
                  </p>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="aisuggestions__input"
                  >
                    <option value="">Choose a category</option>
                    <option value="Running">Running</option>
                    <option value="Film">Film</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Board games">Board games</option>
                    <option value="Hiking">Hiking</option>
                    <option value="Photography">Photography</option>
                    <option value="Reading">Reading</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Cycling">Cycling</option>
                    <option value="Music">Music</option>
                    <option value="Travel">Travel</option>
                    <option value="Chess">Chess</option>
                    <option value="Volunteering">Volunteering</option>
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