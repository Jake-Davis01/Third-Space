import { useState } from "react";
import "../css/Aisuggestions.css";

function Aisuggestions() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showErrorHint, setShowErrorHint] = useState(false);

  const mockInterestedCount = 42;

  const today = new Date().toISOString().split("T")[0];

  const resetModalState = () => {
    setSelectedEvent(null);
    setDate("");
    setMessage("");
    setShowCancelConfirm(false);
    setShowErrorHint(false);
  };

  const handleCreateClick = (title, description) => {
    setSelectedEvent({ title, description });
    setShowModal(true);
    setShowCancelConfirm(false);
    setShowErrorHint(false);
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

  const handleSubmit = () => {
    if (!date || !message.trim()) {
      setShowErrorHint(true);

      setTimeout(() => {
        setShowErrorHint(false);
      }, 1200);

      return;
    }

    setShowModal(false);
    resetModalState();

    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
    }, 4000);
  };

  const canSubmit = date && message.trim();

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

      {/* Suggestions */}
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
                    "Those options are already baked in with this model..."
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
                  Those options are already baked in...
                </p>
              </div>
              <button
                className="aisuggestions__cardButton"
                onClick={() =>
                  handleCreateClick(
                    "Tech Talks",
                    "Those options are already baked in..."
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
                  Those options are already baked in...
                </p>
              </div>
              <button
                className="aisuggestions__cardButton"
                onClick={() =>
                  handleCreateClick(
                    "City Cycles",
                    "Those options are already baked in..."
                  )
                }
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Niche */}
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
                    "A relaxed outdoor picnic where everyone wears headphones..."
                  )
                }
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generator */}
      <div className="aisuggestions__section">
        <div className="aisuggestions__sectionBox">
          <h3 className="aisuggestions__sectionTitle">
            Have Something In Mind?
          </h3>

          <textarea
            className="aisuggestions__textarea"
            placeholder="Enter your idea, budget and estimated head count"
          />

          <button className="aisuggestions__generateButton">
            Generate
          </button>
        </div>
      </div>

      {/* MODAL */}
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

                {/* date field */}
                <div className={`aisuggestions__formGroup ${showErrorHint && !date ? "aisuggestions__error" : ""}`}>
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

                {/* message field */}
                <div className={`aisuggestions__formGroup ${showErrorHint && !message.trim() ? "aisuggestions__error" : ""}`}>
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

                <button
                  className="aisuggestions__generateButton"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                >
                  Schedule Event
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

      {/* CONFIRMATION */}
      {showConfirmation && (
        <div className="aisuggestions__confirmation">
          Your event is now scheduled. Head to your events page to track RSVPs.
        </div>
      )}
    </div>
  );
}

export default Aisuggestions;