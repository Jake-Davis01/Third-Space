DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS insights CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- To store all basic user information
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  job_role TEXT CHECK (job_role IN ('employee', 'admin')) ,
  meetup_preference TEXT NOT NULL,
  user_interests TEXT,
  office_location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- To store all interests
CREATE TABLE interests ( 
    id SERIAL PRIMARY KEY, 
    name TEXT UNIQUE NOT NULL 
);


-- To store all of an employees's interests
CREATE TABLE user_interests (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  interest_id INT REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);


-- To list all events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id INT REFERENCES interests(id), -- reuse interests as categories
  created_by INT REFERENCES users(id), -- officer
  location TEXT,
  event_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- To list all people regestried to an event
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('registered', 'attended', 'cancelled')) DEFAULT 'registered',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

-- To collect all event feedback
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

-- To store all data for the AI to grab insights
CREATE TABLE insights (
  id SERIAL PRIMARY KEY,
  type TEXT, -- e.g. "trend", "warning", "summary"
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- mock data

INSERT INTO interests (name) VALUES
('Running'),
('Film'),
('Reading'),
('Hiking'),
('Board Games');

INSERT INTO users (first_name, last_name, email, password_hash, job_role, meetup_preference) VALUES
('Alice', 'Smith', 'alice@test.com', 'hash', 'employee', 'online'),
('Bob', 'Jones', 'bob@test.com', 'hash', 'employee', 'online'),
('Charlie', 'Brown', 'charlie@test.com', 'hash', 'employee','online'),
('Dana', 'White', 'dana@test.com', 'hash', 'admin','online');

INSERT INTO user_interests (user_id, interest_id) VALUES
(1, 1), -- Alice likes Running
(1, 2),
(2, 1),
(2, 3),
(3, 4),
(3, 5);

INSERT INTO events (title, category_id, created_by, location, event_date) VALUES
('Morning Run', 1, 4, 'Park', '2026-04-10'),
('Movie Night', 2, 4, 'Office', '2026-04-05'),
('Book Club', 3, 4, 'Library', '2026-03-20');

INSERT INTO event_registrations (user_id, event_id, status) VALUES
(1, 1, 'attended'),
(2, 1, 'attended'),
(3, 1, 'registered'),

(1, 2, 'attended'),
(2, 2, 'attended'),

(2, 3, 'attended'),
(3, 3, 'attended');

INSERT INTO feedback (user_id, event_id, rating, comment) VALUES
(1, 1, 5, 'Great run'),
(2, 1, 4, 'Nice'),

(1, 2, 4, 'Fun movie'),
(2, 2, 5, 'Loved it'),

(2, 3, 3, 'Okay'),
(3, 3, 4, 'Good discussion');