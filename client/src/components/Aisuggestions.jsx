import "../css/Aisuggestions.css";

function Aisuggestions() {
  return (
    <div className="aisuggestions__container">
      <h1 className="aisuggestions__title">AI Suggestions Page</h1>

      {/* Suggestions Section */}
      <div className="aisuggestions__content">

        <div className="aisuggestions__sectionBox">
          <h3 className="aisuggestions__sectionTitle">Suggestions</h3>

          <div className="aisuggestions__card">
            <div className="aisuggestions__cardHeader">
              <div className="aisuggestions__cardBody">
                <strong className="aisuggestions__cardTitle">Book Club</strong>
                <p className="aisuggestions__cardText">
                  Those options are already baked in with this model shoot me an email 
                  clear blue water but we need distributors to evangelize the new line to 
                  local markets, but fire up your browser. Strategic high-level 30,000 ft view. 
                  Drill down re-inventing the wheel at the end of the day but curate imagineer, 
                  or to be inspired is to become creative.
                </p>
              </div>
              <button className="aisuggestions__cardButton">Create</button>
            </div>
          </div>

          <div className="aisuggestions__card">
            <div className="aisuggestions__cardHeader">
              <div className="aisuggestions__cardBody">
                <strong className="aisuggestions__cardTitle">Tech Talks</strong>
                <p className="aisuggestions__cardText">
                  Those options are already baked in with this model shoot me an email 
                  clear blue water but we need distributors to evangelize the new line to 
                  local markets, but fire up your browser. Strategic high-level 30,000 ft view. 
                  Drill down re-inventing the wheel at the end of the day but curate imagineer, 
                  or to be inspired is to become creative.
                </p>
              </div>
              <button className="aisuggestions__cardButton">Create</button>
            </div>
          </div>

          <div className="aisuggestions__card">
            <div className="aisuggestions__cardHeader">
              <div className="aisuggestions__cardBody">
                <strong className="aisuggestions__cardTitle">City Cycles</strong>
                <p className="aisuggestions__cardText">
                  Those options are already baked in with this model shoot me an email 
                  clear blue water but we need distributors to evangelize the new line to 
                  local markets, but fire up your browser. Strategic high-level 30,000 ft view. 
                  Drill down re-inventing the wheel at the end of the day but curate imagineer, 
                  or to be inspired is to become creative.
                </p>
              </div>
              <button className="aisuggestions__cardButton">Create</button>
            </div>
          </div>

        </div>
      </div>

      {/* Niche Section */}
      <div className="aisuggestions__section">
        <div className="aisuggestions__sectionBox">
          <h3 className="aisuggestions__sectionTitle">Niche Shite</h3>

          <div className="aisuggestions__emptyCard"></div>
          <div className="aisuggestions__emptyCard"></div>
        </div>
      </div>

      {/* Idea Generator */}
      <div className="aisuggestions__section">
        <div className="aisuggestions__sectionBox">
          <h3 className="aisuggestions__sectionTitle">Idea Generator</h3>

          <textarea
            className="aisuggestions__textarea"
            placeholder="Enter here"
          />

          <button className="aisuggestions__generateButton">
            Generate
          </button>
        </div>
      </div>

    </div>
  );
}

export default Aisuggestions;