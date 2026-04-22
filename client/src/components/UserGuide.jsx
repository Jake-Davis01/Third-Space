import { Link } from "react-router-dom";
import "../css/userGuide.css";

function UserGuide() {
    return (
        <div className="userguide">
            <div className="userguide__container">
                <div className="userguide__header">
                    <h1 className="userguide__title">User Guide</h1>
                    <p className="userguide__subtitle">
                        Everything you need to know to navigate Third Space with confidence.
                    </p>
                </div>

                <div className="userguide__section">
                    <h2 className="userguide__sectionTitle">What is Third Space?</h2>
                    <p className="userguide__text">
                        Third Space is a workplace social platform designed to help employees
                        discover events that match their interests, while helping organisers
                        plan more relevant and engaging activities.
                    </p>
                    <p className="userguide__text">
                        Employees can join events, manage their profile, and leave feedback.
                        Admin users can also access analytics, AI-powered event suggestions,
                        and event management tools.
                    </p>
                </div>

                <div className="userguide__section">
                    <h2 className="userguide__sectionTitle">Getting started</h2>
                    <div className="userguide__card">
                        <ol className="userguide__list userguide__listNumbered">
                            <li>Create an account or log in</li>
                            <li>Select your office location</li>
                            <li>Choose your meetup preference</li>
                            <li>Pick up to five interests</li>
                            <li>Start exploring events and recommendations</li>
                        </ol>
                    </div>
                    <p className="userguide__text">
                        Your profile preferences help personalise the platform and improve the
                        event suggestions you see.
                    </p>
                </div>

                <div className="userguide__section">
                    <h2 className="userguide__sectionTitle">Navigating the platform</h2>

                    <div className="userguide__card">
                        <h3 className="userguide__cardTitle">Home</h3>
                        <p className="userguide__text">
                            The Home page gives you a quick overview of your experience.
                            Here you can view a recommended event, check your next upcoming
                            event, and leave a rating on a recent past event.
                        </p>
                    </div>

                    <div className="userguide__card">
                        <h3 className="userguide__cardTitle">Events</h3>
                        <p className="userguide__text">
                            The Events page shows events you have joined. You can view event
                            details and leave an event if you can no longer attend.
                        </p>
                    </div>

                    <div className="userguide__card">
                        <h3 className="userguide__cardTitle">Profile</h3>
                        <p className="userguide__text">
                            Your Profile page allows you to update your office location,
                            meetup preference, and interests. Keeping this information current
                            helps improve recommendations.
                        </p>
                    </div>
                </div>

                <div className="userguide__section">
                    <h2 className="userguide__sectionTitle">Joining events</h2>
                    <p className="userguide__text">
                        You can join events directly from your recommendations or other event
                        views in the platform.
                    </p>
                    <div className="userguide__card">
                        <ul className="userguide__list">
                            <li>Joined events will appear on your Events page</li>
                            <li>Your participation helps improve future recommendations</li>
                            <li>You can leave an event later if your plans change</li>
                        </ul>
                    </div>
                </div>

                <div className="userguide__section">
                    <h2 className="userguide__sectionTitle">Leaving feedback</h2>
                    <p className="userguide__text">
                        After attending an event, you may be able to leave a star rating.
                        This helps organisers understand what worked well and helps improve
                        future events.
                    </p>
                </div>

                <div className="userguide__section">
                    <h2 className="userguide__sectionTitle">Admin tools</h2>
                    <p className="userguide__text">
                        If you are an admin or event organiser, you will have access to
                        extra features in the navigation bar.
                    </p>

                    <div className="userguide__card">
                        <h3 className="userguide__cardTitle">Dashboard</h3>
                        <p className="userguide__text">
                            The Dashboard provides an overview of engagement across the
                            platform, including active users, registration rates, popular
                            interests, event ratings, and trends over time.
                        </p>
                    </div>

                    <div className="userguide__card">
                        <h3 className="userguide__cardTitle">AI Suggestions</h3>
                        <p className="userguide__text">
                            This page helps organisers create events using data and AI support.
                            You can browse suggested ideas, validate your own event ideas,
                            estimate likely interest, explore venue suggestions, and schedule
                            new events.
                        </p>
                    </div>

                    <div className="userguide__card">
                        <h3 className="userguide__cardTitle">Events Hub</h3>
                        <p className="userguide__text">
                            The Events Hub allows organisers to view all scheduled events and
                            manage them by editing or deleting event details where needed.
                        </p>
                    </div>
                </div>

                <div className="userguide__section">
                    <h2 className="userguide__sectionTitle">Tips for best use</h2>
                    <div className="userguide__card">
                        <ul className="userguide__list">
                            <li>Keep your profile information up to date</li>
                            <li>Choose interests that genuinely reflect what you enjoy</li>
                            <li>Join events you are likely to attend</li>
                            <li>Leave feedback after events to help improve future planning</li>
                            <li>Use the AI Suggestions page if you are an organiser planning a new event</li>
                        </ul>
                    </div>
                </div>

                <div className="userguide__section">
                    <h2 className="userguide__sectionTitle">Need to go back?</h2>
                    <p className="userguide__text">
                        Use the link below to return to home.
                    </p>
                    <Link to="/home" className="userguide__button">Back to home</Link>
                </div>
            </div>
        </div>
    );
}

export default UserGuide;