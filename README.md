# Third Space

A full-stack web application for managing and discovering workplace social events. Employees can browse and join events, while event organisers (admins) have access to a management dashboard, AI-powered event suggestions, and an events hub for editing and deleting events.

## Deployed on:
deployed URL HERE

---

## Tech Stack

**Frontend:** React, React Router, Chart.js  
**Backend:** Node.js, Express  
**Database:** PostgreSQL  
**AI:** Google Gemini API  

---

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL database
- A `.env` file in the root with the following:

```
PORT=3000
DATABASE_URL=your_postgres_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

3. Start the backend:

```bash
cd server
node index.js
```

4. Start the frontend:

```bash
cd client
npm run dev
```

The backend runs on `http://localhost:3000` and the frontend on `http://localhost:5173` by default.

---

## Features

### All Users
- **Login / Sign up** — authenticate with email and password, select office location, meetup preference and up to 5 interests
- **Home page** — see a new recommended event to join, their next upcoming event, and leave a star rating on their most recent past event
- **Events page** — view and leave events they have joined
- **Profile page** — update office location, meetup preference and interests

### Admins (Event Organisers) Only
- **Dashboard** — view analytics including active users, registration percentage, top interests, top events by rating and attendance, and a user growth line chart
- **AI Suggestions** — get AI-generated event recommendations based on employee interests and location data; validate custom event ideas; schedule events directly from suggestions
- **Events Hub** — view all events in the system with the ability to edit (title, description, date, location) or delete any event

---

## API Routes

### Auth — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Log in a user |
| GET | `/profile/:email` | Get user profile |
| PATCH | `/profile/:email` | Update user profile |

### Home — `/api/home`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/newEvent/:userEmail` | Get a new recommended event for the user |
| PATCH | `/newEvent/:id` | Join an event |
| GET | `/nextEvent/:userEmail` | Get the user's next upcoming event |
| GET | `/pastEvent/:userEmail` | Get the user's most recent past event |
| POST | `/pastEvent/` | Submit a star rating for a past event |

### Event Page — `/api/eventPage`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/userEvents/:userEmail` | Get all events a user has joined |
| PATCH | `/userEvents/` | Leave an event |

### Events & AI — `/api`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | Get all events |
| POST | `/events` | Create a new event |
| PATCH | `/events/:id` | Update an event |
| DELETE | `/events/:id` | Delete an event |
| GET | `/ai/popular-events` | Get popular events by interest |
| GET | `/ai/insights` | Get aggregated suggestion insights |
| GET | `/ai/suggestions` | Get AI-generated event suggestions |
| GET | `/ai/interested-count` | Get interested user count by category and location |
| POST | `/ai/validate-idea` | Validate a custom event idea using AI |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all dashboard analytics data |

---

## User Roles

| Role | Access |
|------|--------|
| `employee` | Home, Events, Profile |
| `admin` | Home, Events, Profile, Dashboard, AI Suggestions, Events Hub |

Role is determined at login from the `jobRole` field returned by the auth endpoint.

---

## Database

### Setup

The database schema and seed data live in `server/database/db.sql`. To set it up, run:

```bash
cd server
node setup.js
```

This will drop and recreate all tables and insert mock data.

The environment variable for the database connection is `DB_URL` (set in your `.env` file):

```
DB_URL=your_postgres_connection_string
```

### Schema

**`users`** — stores all user accounts  
`id`, `first_name`, `last_name`, `email` (unique), `password_hash`, `job_role` (`employee` | `admin`), `meetup_preference`, `office_location`, `created_at`

**`interests`** — master list of interest/category options  
`id`, `name` (unique) — e.g. Running, Film, Gaming, Cooking

**`user_interests`** — many-to-many between users and interests  
`user_email` → `users.email`, `interest_name` → `interests.name`

**`events`** — all scheduled events  
`id`, `title`, `description`, `category_name` → `interests.name`, `location`, `event_date`, `created_at`

**`event_categories`** — allows multiple categories per event  
`event_id` → `events.id`, `category_name` → `interests.name`

**`event_registrations`** — tracks who is registered to which event  
`id`, `user_email`, `event_id`, `status` (`registered` | `attended` | `cancelled` | `declined` | `unresponsive`), `registered_at`

**`feedback`** — star ratings and comments left after events  
`id`, `user_email`, `event_id`, `rating` (1–5), `comment`, `created_at`

**`insights`** — stores AI-generated trend data  
`id`, `type`, `content`, `created_at`

---

## Known Issues

- **Events Hub — date not populating in edit modal** — the `event_date` field comes back from the database as a full ISO timestamp (`2026-04-19T23:00:00.000Z`). The date input (`type="date"`) requires `YYYY-MM-DD` format and is sensitive to timezone offset, which causes it to either not populate or show the wrong date. A full fix would require normalising the date on the backend to return a plain `DATE` string, or consistently adjusting for timezone offset on the frontend before passing to the input value.

- **Hardcoded API URLs** — several frontend components reference the production backend URL (`https://third-space-backend-sjay.onrender.com`) directly rather than using an environment variable. This means switching between local and production requires manually updating URLs across multiple files.

- **No authentication tokens** — the app uses `localStorage` to store the user's email and derives their role from the login response, but there is no JWT or session token. Any user who knows another user's email could potentially access their data by manipulating localStorage.

- **Password stored as plain hash label** — the seed data in `db.sql` inserts `'hash'` as the `password_hash` for all mock users. Real registration uses proper hashing, but the mock data bypasses this.

---

## Future Improvements

- **JWT authentication** — replace the current localStorage email approach with proper JWT tokens to secure API routes and properly verify user identity and role on the backend.

- **Protected routes** — add route guards on the frontend so that admin-only pages (`/dashboard`, `/aisuggestions`, `/eventHub`) redirect unauthenticated or non-admin users rather than simply hiding the nav links.

- **Notifications** — notify users when a new event is scheduled that matches their interests or location, either via in-app notification or email.

- **Event search and filtering** — allow users to filter events by category, location or date on the Events page rather than seeing a flat list.

- **Attendance tracking** — build out a way for admins to mark attendees as `attended` after an event ends, which would feed into the dashboard analytics more accurately.

- **Feedback improvements** — allow users to leave a text comment alongside their star rating, and surface this feedback to admins on the dashboard or Events Hub.


- **Date handling** — normalise all `event_date` values to return as plain `YYYY-MM-DD` strings from the backend to avoid timezone offset issues on the frontend.


---

