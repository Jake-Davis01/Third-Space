import '../css/home.css'

import { useState } from "react";

function Home({ name }) {
    const totalStars = 5;

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    return (
        <section>
            <div className="welcome-user container">
                <h1>Welcome Back {name}</h1>
                <p>3 Events this month</p>
            </div>


            <div className="container">
                <h2>New For You</h2>
                <div className="inner-container">
                    <h1>Event Name</h1>
                    <p className="date">Date: 24/06/2026  --  Location: London</p>
                    <p className="details">Details</p>
                    <button className="join-button">Join</button>
                </div>
            </div>


            <div className="container">
                <h2>Upcoming Events</h2>
                <div className="inner-container">
                    <h1>Event Name</h1>
                    <p className="date">Date: 12/05/2026   --   Location: Online</p>
                    <p className="details">Details</p>

                </div>
            </div>


            <div className="container">
                <h2>Last Event - Feedback</h2>
                <div className="inner-container">
                    <div className='star-rating'>
                        {[...Array(totalStars)].map((_, index) => {
                            const starValue = index + 1;

                            const isActive = starValue <= (hover || rating);

                            return (
                                <span
                                    key={index}
                                    className={`star ${isActive ? "active" : ""}`}
                                    onClick={() => setRating(starValue)}
                                    onMouseEnter={() => setHover(starValue)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    ★
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}


export default Home