-- =========================
-- SEED DATA
-- =========================

-- interests
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


-- users
INSERT INTO users (first_name, last_name, email, password_hash, job_role, created_at) VALUES
('Alice', 'Smith', 'alice@test.com', 'hash', 'employee', '2026-04-01 09:00:00'),
('Bob', 'Jones', 'bob@test.com', 'hash', 'employee', '2026-03-01 09:00:00'),
('Charlie', 'Brown', 'charlie@test.com', 'hash', 'employee', '2026-02-01 09:00:00'),
('Dana', 'White', 'dana@test.com', 'hash', 'admin', '2026-02-01 09:00:00'),
('Edward', 'Smith', 'edward@test.com', 'hash', 'employee', '2026-01-01 09:00:00'),
('Florence', 'Jones', 'florence@test.com', 'hash', 'employee', '2025-12-01 09:00:00'),
('Geneva', 'Brown', 'geneva@test.com', 'hash', 'employee', '2025-11-01 09:00:00'),
('Hugh', 'White', 'hugh@test.com', 'hash', 'admin', '2025-11-01 09:00:00');


-- user_interests
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


-- events
INSERT INTO events (title, description, category_name, location, event_date, created_at) VALUES
('Morning Running Club', 'A casual 5K run around the park to start the day.', 'Running', 'London', '2026-04-20', '2026-01-01 09:00:00'),
('Film Night Social', 'Weekly movie screening and discussion night.', 'Film', 'Edinburgh', '2026-04-22', '2026-01-01 09:00:00'),
('Board Games & Chill', 'Bring your favourite board game and meet new people.', 'Board games', 'Manchester', '2026-04-24', '2026-01-01 09:00:00'),
('Beginner Yoga Session', 'Relaxing yoga session for all levels.', 'Yoga', 'Fully remote', '2026-04-25', '2026-01-01 09:00:00'),
('Travel Talk Meetup', 'Share travel stories and plan future trips.', 'Travel', 'Fully remote', '2026-04-27', '2026-01-01 09:00:00');


-- event_registrations
INSERT INTO event_registrations (user_email, event_id, status) VALUES
('alice@test.com', 1, 'registered'),
('alice@test.com', 2, 'registered'),
('alice@test.com', 5, 'registered'),

('bob@test.com', 3, 'registered'),
('bob@test.com', 2, 'attended'),
('bob@test.com', 4, 'registered'),

('charlie@test.com', 1, 'registered'),
('charlie@test.com', 5, 'registered'),
('charlie@test.com', 3, 'declined'),

('dana@test.com', 4, 'registered'),
('dana@test.com', 5, 'registered'),
('dana@test.com', 2, 'attended'),

('edward@test.com', 1, 'registered'),
('edward@test.com', 3, 'registered'),
('edward@test.com', 4, 'unresponsive'),

('florence@test.com', 2, 'registered'),
('florence@test.com', 5, 'registered'),
('florence@test.com', 1, 'cancelled');


-- feedback
INSERT INTO feedback (user_email, event_id, rating, comment) VALUES
('alice@test.com', 1, 5, 'Great energy and a really friendly group.'),
('charlie@test.com', 1, 4, 'Good pace, would join again.'),

('alice@test.com', 2, 4, 'Nice selection of films and good discussion afterwards.'),
('bob@test.com', 2, 5, 'Really well organised, loved the atmosphere.'),
('dana@test.com', 2, 4, 'Fun evening, will come back.'),

('bob@test.com', 3, 5, 'Super fun, lots of games to choose from.'),
('charlie@test.com', 3, 3, 'Good idea but a bit crowded.'),
('edward@test.com', 3, 4, 'Enjoyed meeting new people.'),

('bob@test.com', 4, 4, 'Relaxing and easy to follow.'),
('dana@test.com', 4, 5, 'Perfect session for unwinding.'),
('edward@test.com', 4, 3, 'A bit slow for my pace but still good.'),

('alice@test.com', 5, 5, 'Loved hearing everyone’s travel stories.'),
('charlie@test.com', 5, 4, 'Inspiring and fun group.'),
('dana@test.com', 5, 5, 'Great for sharing ideas and meeting people.'),
('florence@test.com', 5, 4, 'Really enjoyable and friendly crowd.');