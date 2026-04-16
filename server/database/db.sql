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
  meetup_preference TEXT,
  user_interests TEXT,
  office_location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- To store all interests
CREATE TABLE interests ( 
    id SERIAL, 
    name TEXT UNIQUE NOT NULL PRIMARY KEY
);


-- To store all of an employees's interests
CREATE TABLE user_interests (
  user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
  interest_name TEXT REFERENCES interests(name) ON DELETE CASCADE,
  PRIMARY KEY (user_email, interest_name)
);


-- To list all events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_name TEXT REFERENCES interests(name), -- reuse interests as categories
  location TEXT,
  event_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- To list all people regestried to an event
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
  event_title TEXT REFERENCES events(title) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('registered', 'attended', 'cancelled', 'declined', 'unresponsive')) DEFAULT 'unresponsive',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, event_title)
);

-- To collect all event feedback
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
  event_title TEXT REFERENCES events(title) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, event_title)
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
('Gaming'),
('Cooking'),
('Board games'),
('Hiking'),
('Photography'),
('Reading'),
('Yoga'),
('Cycling'),
('Music'),
('Travel'),
('Chess'),
('Volunteering');

INSERT INTO users (first_name, last_name, email, password_hash, job_role, created_at) VALUES
('Alice', 'Smith', 'alice@test.com', 'hash', 'employee', '2026-04-01 09:00:00'),
('Bob', 'Jones', 'bob@test.com', 'hash', 'employee', '2026-03-01 09:00:00'),
('Charlie', 'Brown', 'charlie@test.com', 'hash', 'employee', '2026-02-01 09:00:00'),
('Dana', 'White', 'dana@test.com', 'hash', 'admin', '2026-02-01 09:00:00'),
('Edward', 'Smith', 'edward@test.com', 'hash', 'employee', '2026-01-01 09:00:00'),
('Florence', 'Jones', 'florence@test.com', 'hash', 'employee', '2025-12-01 09:00:00'),
('Geneva', 'Brown', 'geneva@test.com', 'hash', 'employee', '2025-11-01 09:00:00'),
('Hugh', 'White', 'hugh@test.com', 'hash', 'admin', '2025-11-01 09:00:00');

INSERT INTO user_interests (user_email, interest_name) VALUES
('alice@test.com', 'Running'),
('alice@test.com', 'Film'),
('alice@test.com', 'Reading'),

('bob@test.com', 'Gaming'),
('bob@test.com', 'Cooking'),
('bob@test.com', 'Board games'),

('charlie@test.com', 'Hiking'),
('charlie@test.com', 'Photography'),
('charlie@test.com', 'Travel'),

('dana@test.com', 'Yoga'),
('dana@test.com', 'Cycling'),
('dana@test.com', 'Music'),

('edward@test.com', 'Running'),
('edward@test.com', 'Hiking'),
('edward@test.com', 'Cycling'),

('florence@test.com', 'Film'),
('florence@test.com', 'Reading'),
('florence@test.com', 'Music'),

('geneva@test.com', 'Gaming'),
('geneva@test.com', 'Chess'),
('geneva@test.com', 'Board games'),

('hugh@test.com', 'Cooking'),
('hugh@test.com', 'Travel'),
('hugh@test.com', 'Volunteering');

INSERT INTO events (title, description, category_name, location, event_date, created_at) VALUES
('Morning Running Club', 'A casual 5K run around the park to start the day.', 'Running', 'London', '2026-04-20', '2026-01-01 09:00:00'),
('Film Night Social', 'Weekly movie screening and discussion night.', 'Film', 'Edinburgh', '2026-04-22', '2026-01-01 09:00:00'),
('Board Games & Chill', 'Bring your favourite board game and meet new people.', 'Board games', 'Manchester', '2026-04-24', '2026-01-01 09:00:00'),
('Beginner Yoga Session', 'Relaxing yoga session for all levels.', 'Yoga', 'Fully remote', '2026-04-25', '2026-01-01 09:00:00'),
('Travel Talk Meetup', 'Share travel stories and plan future trips.', 'Travel', 'Fully remote', '2026-04-27', '2026-01-01 09:00:00');

INSERT INTO event_registrations (user_email, event_title, status) VALUES
-- Alice
('alice@test.com', 'Morning Running Club', 'registered'),
('alice@test.com', 'Film Night Social', 'registered'),
('alice@test.com', 'Travel Talk Meetup', 'registered'),

-- Bob
('bob@test.com', 'Board Games & Chill', 'registered'),
('bob@test.com', 'Film Night Social', 'attended'),
('bob@test.com', 'Beginner Yoga Session', 'registered'),

-- Charlie
('charlie@test.com', 'Morning Running Club', 'registered'),
('charlie@test.com', 'Travel Talk Meetup', 'registered'),
('charlie@test.com', 'Board Games & Chill', 'declined'),

-- Dana
('dana@test.com', 'Beginner Yoga Session', 'registered'),
('dana@test.com', 'Travel Talk Meetup', 'registered'),
('dana@test.com', 'Film Night Social', 'attended'),

-- Edward
('edward@test.com', 'Morning Running Club', 'registered'),
('edward@test.com', 'Board Games & Chill', 'registered'),
('edward@test.com', 'Beginner Yoga Session', 'unresponsive'),

-- Florence
('florence@test.com', 'Film Night Social', 'registered'),
('florence@test.com', 'Travel Talk Meetup', 'registered'),
('florence@test.com', 'Morning Running Club', 'cancelled');


INSERT INTO feedback (user_email, event_title, rating, comment) VALUES

-- Morning Running Club
('alice@test.com', 'Morning Running Club', 5, 'Great energy and a really friendly group.'),
('charlie@test.com', 'Morning Running Club', 4, 'Good pace, would join again.'),

-- Film Night Social
('alice@test.com', 'Film Night Social', 4, 'Nice selection of films and good discussion afterwards.'),
('bob@test.com', 'Film Night Social', 5, 'Really well organised, loved the atmosphere.'),
('dana@test.com', 'Film Night Social', 4, 'Fun evening, will come back.'),

-- Board Games & Chill
('bob@test.com', 'Board Games & Chill', 5, 'Super fun, lots of games to choose from.'),
('charlie@test.com', 'Board Games & Chill', 3, 'Good idea but a bit crowded.'),
('edward@test.com', 'Board Games & Chill', 4, 'Enjoyed meeting new people.'),

-- Beginner Yoga Session
('bob@test.com', 'Beginner Yoga Session', 4, 'Relaxing and easy to follow.'),
('dana@test.com', 'Beginner Yoga Session', 5, 'Perfect session for unwinding.'),
('edward@test.com', 'Beginner Yoga Session', 3, 'A bit slow for my pace but still good.'),

-- Travel Talk Meetup
('alice@test.com', 'Travel Talk Meetup', 5, 'Loved hearing everyone’s travel stories.'),
('charlie@test.com', 'Travel Talk Meetup', 4, 'Inspiring and fun group.'),
('dana@test.com', 'Travel Talk Meetup', 5, 'Great for sharing ideas and meeting people.'),
('florence@test.com', 'Travel Talk Meetup', 4, 'Really enjoyable and friendly crowd.');

