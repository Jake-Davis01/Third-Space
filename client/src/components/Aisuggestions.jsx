import { useEffect, useMemo, useState } from "react";
import "../css/Aisuggestions.css";

function Aisuggestions() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editableTitle, setEditableTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
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
  const [showGeneratorCancelConfirm, setShowGeneratorCancelConfirm] =
    useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [liveInterestedCount, setLiveInterestedCount] = useState(null);
  const [isLoadingInterestedCount, setIsLoadingInterestedCount] =
    useState(false);
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [isLoadingLocationSuggestions, setIsLoadingLocationSuggestions] =
    useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [noBudgetRequired, setNoBudgetRequired] = useState(false); // added: let the organiser mark the event as free, self-funded, or not needing company budget

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

  const descriptionLibrary = {
    Running: [
      "Swap screens for fresh air with a social run that keeps the pace light and the chats flowing.",
      "An easygoing group run to boost energy, clear heads and help people connect naturally.",
      "A feel-good run that turns movement into mingling without making it feel like forced networking.",
    ],
    Film: [
      "A cinema-style social that gives everyone an easy reason to unwind and talk afterwards.",
      "A relaxed film meetup built for shared laughs, strong opinions and post-credit chats.",
      "An easy win for a social evening: one great film and plenty to talk about after.",
    ],
    "Board games": [
      "A playful low-pressure social where teams can compete, laugh and mix beyond their usual circles.",
      "A board game session that makes meeting new people feel easy, lively and genuinely fun.",
      "An easy social pick: quick games, lots of laughs and no awkward small talk required.",
    ],
    Gaming: [
      "A friendly gaming session that brings out teamwork, banter and a little healthy competition.",
      "A fun multiplayer meetup for people who want something more lively than the usual social.",
      "A game night built for relaxed competition, shared wins and easy conversation.",
    ],
    Cooking: [
      "A hands-on social where people can learn something new while chatting over good food.",
      "A cooking session that mixes teamwork, creativity and an easy excuse to eat well together.",
      "A feel-good foodie event that gets people involved from the first chop to the last bite.",
    ],
    Hiking: [
      "A scenic group walk that makes catching up and meeting new people feel effortless.",
      "A social hike designed for fresh air, easy conversation and a proper reset from the desk.",
      "A low-pressure outdoor meetup where the route gives the day its rhythm and energy.",
    ],
    Photography: [
      "A creative photo walk that gives people something to do together from the first minute.",
      "A relaxed photography meetup built around exploring, sharing ideas and spotting great shots.",
      "A social with a creative twist that makes conversation flow as naturally as the route.",
    ],
    Reading: [
      "A cosy reading social that gives book lovers an easy way to connect over fresh recommendations.",
      "A calm, thoughtful meetup for people who enjoy quiet moments and lively book chat afterwards.",
      "A bookish social that feels warm, welcoming and much more fun than another standard meeting.",
    ],
    Yoga: [
      "A calming group session designed to help people reset, breathe and reconnect.",
      "A wellness-focused social that keeps things gentle, friendly and easy to join.",
      "A relaxed yoga meetup that blends movement, mindfulness and a bit of team bonding.",
    ],
    Cycling: [
      "A social ride that keeps energy high and conversation easy from start to finish.",
      "A refreshing cycling meetup that mixes movement, momentum and good company.",
      "A team ride built for fresh air, shared pace and a welcome break from routine.",
    ],
    Music: [
      "A music-led social that gives people a fun setting to relax, chat and enjoy the atmosphere.",
      "A lively meetup where playlists, performances or shared favourites do the ice-breaking for you.",
      "A feel-good music event designed to get people talking without forcing it.",
    ],
    Travel: [
      "A travel-themed social where stories, ideas and future plans do all the heavy lifting.",
      "A relaxed meetup for curious minds who love swapping recommendations and memorable travel moments.",
      "A conversation-friendly event built around shared adventures and fresh inspiration.",
    ],
    Chess: [
      "A thoughtful social with just enough competition to keep things interesting.",
      "A chess meetup that creates easy one-to-one interactions without the usual awkwardness.",
      "A smart, low-key event where strategy and conversation go hand in hand.",
    ],
    Volunteering: [
      "A purpose-driven social that helps people connect while doing something genuinely worthwhile.",
      "A feel-good team event that blends community impact with meaningful conversation.",
      "A rewarding meetup where shared effort naturally turns into stronger team bonds.",
    ],
    default: [
      "A fun social idea designed to help people connect in a more natural, low-pressure way.",
      "A fresh event option that gives people an easy reason to join in and meet others.",
      "A simple, social-first activity that turns shared interests into stronger connections.",
    ],
  };

  const costRules = {
    Running: { type: "mostlyFree", minPerPerson: 0, maxPerPerson: 3 },
    Film: { type: "perPerson", minPerPerson: 9, maxPerPerson: 18 }, // added: use a realistic range rather than one fixed figure
    "Board games": { type: "perPerson", minPerPerson: 4, maxPerPerson: 12 }, // added: allow for table fees, snacks, or venue spend
    Gaming: { type: "perPerson", minPerPerson: 5, maxPerPerson: 14 }, // added: allow for arcade, console lounge, or booking costs
    Cooking: { type: "perPerson", minPerPerson: 18, maxPerPerson: 40 }, // added: ingredients and workshop pricing vary a lot
    Hiking: { type: "mostlyFree", minPerPerson: 0, maxPerPerson: 5 },
    Photography: { type: "mostlyFree", minPerPerson: 0, maxPerPerson: 5 },
    Reading: { type: "mostlyFree", minPerPerson: 0, maxPerPerson: 4 },
    Yoga: { type: "perPerson", minPerPerson: 8, maxPerPerson: 18 }, // added: studio and instructor costs vary by city
    Cycling: { type: "mostlyFree", minPerPerson: 0, maxPerPerson: 6 },
    Music: { type: "perPerson", minPerPerson: 10, maxPerPerson: 30 }, // added: live music, karaoke, and venue minimums vary widely
    Travel: { type: "mostlyFree", minPerPerson: 0, maxPerPerson: 8 },
    Chess: { type: "perPerson", minPerPerson: 0, maxPerPerson: 8 },
    Volunteering: { type: "mostlyFree", minPerPerson: 0, maxPerPerson: 4 },
  };

  const locationMultipliers = {
    "Fully remote": 0,
    London: 1.3, // added: london typically carries higher event costs
    Edinburgh: 1.12,
    Manchester: 1.0,
    Birmingham: 0.96,
  };

  const generateTimeOptions = () => {
    const options = [];

    for (let hour = 8; hour <= 20; hour += 1) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hh = String(hour).padStart(2, "0");
        const mm = String(minute).padStart(2, "0");
        options.push(`${hh}:${mm}`);
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  const formatTimeLabel = (timeValue) => {
    if (!timeValue) return "";

    const [hourString, minuteString] = timeValue.split(":");
    const hour = Number(hourString);
    const minute = Number(minuteString);

    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
  };

  const pickRandom = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) return "";
    return items[Math.floor(Math.random() * items.length)];
  };

  const getEventCategory = (event) => {
    if (event?.categories?.length > 0) return event.categories[0];
    if (event?.category_name) return event.category_name;
    return "default";
  };

  const getFunDescription = (event) => {
    const category = getEventCategory(event);
    return pickRandom(descriptionLibrary[category] || descriptionLibrary.default);
  };

  const estimateCost = (event) => {
    if (noBudgetRequired) {
      return {
        label: "No organiser budget needed", // added: clearer label for free, self-funded, or zero-budget plans
        total: 0,
        minTotal: 0,
        maxTotal: 0,
      };
    }

    const category = getEventCategory(event);
    const interestedCount = Math.max(Number(event?.interested_count) || 0, 1);
    const chosenLocation = event?.best_location || "Manchester";

    const rule = costRules[category];

    if (!rule) {
      return {
        label: "Estimated cost: varies",
        total: null,
        minTotal: null,
        maxTotal: null,
      };
    }

    if (chosenLocation === "Fully remote") {
      return {
        label: "Estimated cost: little to no organiser spend",
        total: 0,
        minTotal: 0,
        maxTotal: 0,
      };
    }

    const multiplier = locationMultipliers[chosenLocation] ?? 1;

    const minTotal = Math.round(rule.minPerPerson * interestedCount * multiplier); // added: lower end of the cost range
    const maxTotal = Math.round(rule.maxPerPerson * interestedCount * multiplier); // added: upper end of the cost range
    const averageTotal = Math.round((minTotal + maxTotal) / 2);

    if (minTotal === 0 && maxTotal === 0) {
      return {
        label: "Estimated cost: likely free or very low-cost",
        total: 0,
        minTotal: 0,
        maxTotal: 0,
      };
    }

    return {
      label: `Estimated cost: £${minTotal}–£${maxTotal}`, // added: present pricing as a range instead of a single number
      total: averageTotal,
      minTotal,
      maxTotal,
    };
  };

  const getVerdictClass = (value = "") => {
    const normalised = value.toLowerCase();

    if (normalised === "good idea") return "aisuggestions__statusGood";
    if (normalised === "maybe") return "aisuggestions__statusMedium";
    if (normalised === "not recommended") return "aisuggestions__statusBad";

    return "aisuggestions__statusMedium";
  };

  const getConfidenceClass = (value = "") => {
    const normalised = value.toLowerCase();

    if (normalised === "high") return "aisuggestions__statusGood";
    if (normalised === "medium") return "aisuggestions__statusMedium";
    if (normalised === "low") return "aisuggestions__statusBad";

    return "aisuggestions__statusMedium";
  };

  useEffect(() => {
    const fetchAiSuggestions = async () => {
      try {
        setIsLoadingPopular(true);

        const response = await fetch("https://third-space-backend-sjay.onrender.com/api/ai/suggestions");

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("AI SUGGESTIONS FROM API:", data);

        const combinedSuggestions = [
          ...(Array.isArray(data.topSuggestions) ? data.topSuggestions : []),
          ...(data.nicheSuggestion ? [data.nicheSuggestion] : []),
        ].map((event, index) => ({
          ...event,
          id: event.id || `${event.title}-${index}`,
          fun_description: getFunDescription(event),
        }));

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

  useEffect(() => {
    const fetchInterestedCount = async () => {
      if (!showModal) return;

      if (!primaryCategory || !location) {
        setLiveInterestedCount(Number(selectedEvent?.interested_count) || 0);
        return;
      }

      try {
        setIsLoadingInterestedCount(true);

        const params = new URLSearchParams({
          category_name: primaryCategory,
          location,
        });

        const response = await fetch(
          `https://third-space-backend-sjay.onrender.com/api/ai/interested-count?${params.toString()}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        setLiveInterestedCount(Number(data.interested_count) || 0);
      } catch (err) {
        console.error("Error fetching interested count:", err);
        setLiveInterestedCount(Number(selectedEvent?.interested_count) || 0);
      } finally {
        setIsLoadingInterestedCount(false);
      }
    };

    fetchInterestedCount();
  }, [showModal, primaryCategory, location, selectedEvent]);

  const resetModalState = () => {
    setSelectedEvent(null);
    setEditableTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setCategories([]);
    setPrimaryCategory("");
    setMessage("");
    setShowCancelConfirm(false);
    setShowErrorHint(false);
    setSubmitError("");
    setIsSubmitting(false);
    setLiveInterestedCount(null);
    setIsLoadingInterestedCount(false);
    setSuggestedLocations([]);
    setIsLoadingLocationSuggestions(false);
    setSelectedVenue(null);
    setNoBudgetRequired(false); // added: reset the budget toggle when the modal closes
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
    interestedCount = 0,
    bestLocation = ""
  ) => {
    setSelectedEvent({
      title,
      description,
      interested_count: interestedCount,
      categories: defaultCategories,
      category_name: defaultCategories[0] || "",
      best_location: bestLocation, // added: preserve the suggestion's original location so card and popup pricing stay aligned
    });
    setEditableTitle(title);
    setDate("");
    setTime("");
    setLocation("");
    setMessage("");
    setCategories(defaultCategories);
    setPrimaryCategory(defaultCategories[0] || "");
    setLiveInterestedCount(Number(interestedCount) || 0);
    setSuggestedLocations([]);
    setSelectedVenue(null);
    setNoBudgetRequired(false); // added: start each scheduling flow with the normal budget estimate enabled
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
        setPrimaryCategory(updatedCategories[0] || "");
      }
    } else {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);

      if (!primaryCategory) {
        setPrimaryCategory(category);
      }
    }
  };

  const buildFinalEmployeeMessage = () => {
    const baseMessage = message.trim();

    const metadataLines = [
      time ? `Event time: ${time}` : "",
      selectedVenue ? `Venue: ${selectedVenue.name}` : "",
      selectedVenue?.address ? `Address: ${selectedVenue.address}` : "",
      selectedVenue?.requires_booking === false
        ? "Booking: no advance booking is usually needed."
        : selectedVenue?.booking_url
        ? `Booking link: ${selectedVenue.booking_url}`
        : "",
    ].filter(Boolean); // added: budget metadata is intentionally not included so it does not show on the employee home page

    if (metadataLines.length === 0) {
      return baseMessage;
    }

    return `${baseMessage}\n\n${metadataLines.join("\n")}`;
  };

  const handleSubmit = async () => {
    console.log("SUBMIT CLICKED");

    if (
      !editableTitle.trim() ||
      !date ||
      !time ||
      !location ||
      categories.length === 0 ||
      !primaryCategory ||
      !message.trim()
    ) {
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
      console.log("selected time:", time);

      const response = await fetch("https://third-space-backend-sjay.onrender.com/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editableTitle.trim(),
          description: buildFinalEmployeeMessage(),
          event_date: date,
          event_time: time,
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
    time &&
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

      const response = await fetch("https://third-space-backend-sjay.onrender.com/api/ai/validate-idea", {
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

      const response = await fetch("https://third-space-backend-sjay.onrender.com/api/ai/validate-idea", {
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
      categories: ideaToUse?.categories || [],
      category_name: ideaToUse?.categories?.[0] || "",
      best_location: "", // added: generated ideas do not yet have a locked suggested location
    });
    setEditableTitle(ideaToUse?.title || generatorInput);
    setDate("");
    setTime("");
    setLocation("");
    setMessage("");
    setCategories(ideaToUse?.categories || []);
    setPrimaryCategory(ideaToUse?.categories?.[0] || "");
    setLiveInterestedCount(Number(ideaToUse?.interested_count) || 0);
    setSuggestedLocations([]);
    setSelectedVenue(null);
    setNoBudgetRequired(false); // added: reset the free/self-funded toggle when using a generated idea
    setShowModal(true);
    setSubmitError("");
  };

  const handleSuggestLocations = async () => {
    try {
      console.log("SUGGEST VENUES CLICKED");
      setIsLoadingLocationSuggestions(true);
      setSuggestedLocations([]);
      setSelectedVenue(null);

      const payload = {
        activity: editableTitle,
        category: primaryCategory || categories[0] || "",
        city:
          location && location !== "Fully remote" ? location : "Manchester",
        date,
      };

      console.log("VENUE REQUEST PAYLOAD:", payload);

      const response = await fetch(
        "https://third-space-backend-sjay.onrender.com/api/ai/suggest-locations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("VENUE RESPONSE STATUS:", response.status);

      const data = await response.json();
      console.log("VENUE RESPONSE DATA:", data);

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status} ${JSON.stringify(data)}`
        );
      }

      setSuggestedLocations(
        Array.isArray(data.locations) ? data.locations : []
      );
    } catch (err) {
      console.error("Error suggesting locations:", err);
      setSuggestedLocations([]);
    } finally {
      setIsLoadingLocationSuggestions(false);
    }
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

  const selectedEventCostPreview = useMemo(() => {
    if (!selectedEvent) return null;

    const eventForEstimate = {
      ...selectedEvent,
      category_name:
        primaryCategory || categories[0] || selectedEvent.category_name,
      categories:
        categories.length > 0 ? categories : selectedEvent.categories,
      interested_count:
        liveInterestedCount ?? (Number(selectedEvent?.interested_count) || 0),
      best_location:
        location || selectedEvent?.best_location || "Manchester", // added: keep popup pricing aligned with the card until the organiser chooses a different location
    };

    return estimateCost(eventForEstimate);
  }, [
    selectedEvent,
    primaryCategory,
    categories,
    location,
    liveInterestedCount,
    noBudgetRequired, // added: update the preview immediately when the no-budget toggle changes
  ]);

  const LoadingIndicator = ({ text = "Loading..." }) => (
    <div className="aisuggestions__loadingWrap">
      <div className="aisuggestions__spinner"></div>
      <span>{text}</span>
    </div>
  );

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
            <LoadingIndicator text="Loading suggestions..." />
          ) : topSuggestions.length > 0 ? (
            topSuggestions.map((event, index) => {
              const costInfo = estimateCost(event);

              return (
                <div
                  className="aisuggestions__card"
                  key={event.id || `${event.title}-${index}`}
                >
                  <div className="aisuggestions__cardHeader">
                    <div className="aisuggestions__cardBody">
                      <strong className="aisuggestions__cardTitle">
                        {event.title}
                      </strong>
                      <p className="aisuggestions__cardText">
                        {event.fun_description}
                        <br />
                        Interested members: {Number(event.interested_count) || 0} |{" "}
                        {costInfo.label}
                      </p>
                    </div>
                    <button
                      className="aisuggestions__cardButton"
                      onClick={() =>
                        handleCreateClick(
                          event.title,
                          event.description,
                          event.categories && event.categories.length > 0
                            ? event.categories
                            : event.category_name
                            ? [event.category_name]
                            : [],
                          Number(event.interested_count) || 0,
                          event.best_location // added: keep the original suggestion location when opening the popup
                        )
                      }
                    >
                      Create
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="aisuggestions__cardText">
              No suggestions available yet.
            </p>
          )}
        </div>
      </div>

      <div className="aisuggestions__section">
        <div className="aisuggestions__sectionBox">
          <h3 className="aisuggestions__sectionTitle">
            Let's Try Something Different
          </h3>

          {isLoadingPopular ? (
            <LoadingIndicator text="Loading event..." />
          ) : nicheSuggestion ? (
            <div className="aisuggestions__nicheCard">
              <div className="aisuggestions__cardHeader">
                <div className="aisuggestions__cardBody">
                  <strong className="aisuggestions__cardTitle">
                    {nicheSuggestion.title}
                  </strong>
                  <p className="aisuggestions__cardText">
                    {nicheSuggestion.fun_description}
                    <br />
                    Interested members: {Number(nicheSuggestion.interested_count) || 0} |{" "}
                    {estimateCost(nicheSuggestion).label}
                  </p>
                </div>
                <button
                  className="aisuggestions__cardButton"
                  onClick={() =>
                    handleCreateClick(
                      nicheSuggestion.title,
                      nicheSuggestion.description,
                      nicheSuggestion.categories &&
                        nicheSuggestion.categories.length > 0
                        ? nicheSuggestion.categories
                        : nicheSuggestion.category_name
                        ? [nicheSuggestion.category_name]
                        : [],
                      Number(nicheSuggestion.interested_count) || 0,
                      nicheSuggestion.best_location // added: keep the original niche suggestion location when opening the popup
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
                  {isGenerating ? (
                    <>
                      <span className="aisuggestions__spinnerSmall"></span>
                      Generating...
                    </>
                  ) : (
                    "Generate Idea"
                  )}
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
                      <strong>Verdict:</strong>{" "}
                      <span className={getVerdictClass(generatedIdea.verdict)}>
                        {generatedIdea.verdict}
                      </span>{" "}
                      | <strong>Confidence:</strong>{" "}
                      <span
                        className={getConfidenceClass(generatedIdea.confidence)}
                      >
                        {generatedIdea.confidence}
                      </span>
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
                    showErrorHint && !editableTitle.trim()
                      ? "aisuggestions__error"
                      : ""
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
                  {isLoadingInterestedCount ? (
                    <>
                      <span className="aisuggestions__spinnerSmall"></span>
                      Updating...
                    </>
                  ) : (
                    liveInterestedCount ??
                    (Number(selectedEvent?.interested_count) || 0)
                  )}
                </p>

                {selectedEventCostPreview && (
                  <p>
                    <strong>Estimated Cost:</strong>{" "}
                    {selectedEventCostPreview.label}
                  </p>
                )}

                <div className="aisuggestions__formGroup">
                  <label className="aisuggestions__label">
                    Budget Handling
                  </label>

                  <p className="aisuggestions__helperText">
                    Tick this if the event is free, self-funded, or does not need an organiser budget.
                  </p>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.95rem",
                      color: "#0B0033",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={noBudgetRequired}
                      onChange={(e) => setNoBudgetRequired(e.target.checked)} // added: let the organiser override the estimate when no company budget is needed
                    />
                    No organiser budget needed
                  </label>
                </div>

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
                    showErrorHint && !time ? "aisuggestions__error" : ""
                  }`}
                >
                  <label className="aisuggestions__label">
                    Select Event Time
                  </label>

                  <p className="aisuggestions__helperText">
                    Choose a start time for the event
                  </p>

                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="aisuggestions__input"
                  >
                    <option value="">Choose a time</option>
                    {timeOptions.map((timeOption) => (
                      <option key={timeOption} value={timeOption}>
                        {formatTimeLabel(timeOption)}
                      </option>
                    ))}
                  </select>
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

                <button
                  type="button"
                  className="aisuggestions__generateButton"
                  onClick={handleSuggestLocations}
                  disabled={isLoadingLocationSuggestions}
                >
                  {isLoadingLocationSuggestions ? (
                    <>
                      <span className="aisuggestions__spinnerSmall"></span>
                      Finding venue suggestions...
                    </>
                  ) : (
                    "Suggest Real Venues"
                  )}
                </button>

                {suggestedLocations.length > 0 && (
                  <div className="aisuggestions__formGroup">
                    <label className="aisuggestions__label">
                      Suggested Venues
                    </label>

                    <p className="aisuggestions__helperText">
                      These are live venue suggestions matched to this event idea
                      and selected city.
                    </p>

                    {suggestedLocations.map((place, index) => {
                      const isSelected = selectedVenue?.name === place.name;

                      return (
                        <div
                          key={`${place.name}-${index}`}
                          className="aisuggestions__card"
                          style={{
                            borderColor: isSelected ? "#9333ea" : undefined,
                            boxShadow: isSelected
                              ? "0 0 0 2px rgba(147, 51, 234, 0.15)"
                              : undefined,
                          }}
                        >
                          <div className="aisuggestions__cardHeader">
                            <div className="aisuggestions__cardBody">
                              <strong className="aisuggestions__cardTitle">
                                {place.name}
                              </strong>
                              <p className="aisuggestions__cardText">
                                {place.address}
                                <br />
                                {place.why_it_fits}
                                {place.requires_booking === false && (
                                  <>
                                    <br />
                                    No advance booking usually needed.
                                  </>
                                )}
                                {place.booking_url && (
                                  <>
                                    <br />
                                    <a
                                      href={place.booking_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Book venue
                                    </a>
                                  </>
                                )}
                                <br />
                                <em>{place.source_hint}</em>
                              </p>
                            </div>

                            <button
                              type="button"
                              className="aisuggestions__cardButton"
                              onClick={() => setSelectedVenue(place)}
                            >
                              {isSelected ? "Selected" : "Use Venue"}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {selectedVenue && (
                      <p className="aisuggestions__helperText">
                        Selected venue: <strong>{selectedVenue.name}</strong>
                      </p>
                    )}
                  </div>
                )}

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
                    showErrorHint && !primaryCategory
                      ? "aisuggestions__error"
                      : ""
                  }`}
                >
                  <label className="aisuggestions__label">
                    Select Primary Category
                  </label>

                  <p className="aisuggestions__helperText">
                    Choose the main category that should be saved in the events
                    table.
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
                    showErrorHint && !message.trim()
                      ? "aisuggestions__error"
                      : ""
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
                  {isSubmitting ? (
                    <>
                      <span className="aisuggestions__spinnerSmall"></span>
                      Saving...
                    </>
                  ) : (
                    "Schedule Event"
                  )}
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
