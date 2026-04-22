DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS event_categories CASCADE;
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


-- So that user can assign multiple categories to one event
CREATE TABLE event_categories (
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  category_name TEXT REFERENCES interests(name) ON DELETE CASCADE,
  PRIMARY KEY (event_id, category_name)
);


-- To list all people regestried to an event
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('registered', 'attended', 'cancelled', 'declined', 'unresponsive')) DEFAULT 'unresponsive',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, event_id)
);

-- To collect all event feedback
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, event_id)
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

INSERT INTO users (first_name, last_name, email, password_hash, job_role, created_at, office_location) VALUES
('Alice', 'Smith', 'alice@test.com', 'hash', 'employee', '2026-04-01 09:00:00', 'London'),
('Bob', 'Jones', 'bob@test.com', 'hash', 'employee', '2026-03-01 09:00:00', 'London'),
('Charlie', 'Brown', 'charlie@test.com', 'hash', 'employee', '2026-02-01 09:00:00', 'London'),
('Dana', 'White', 'dana@test.com', 'hash', 'admin', '2026-02-01 09:00:00', 'London'),
('Edward', 'Smith', 'edward@test.com', 'hash', 'employee', '2026-01-01 09:00:00', 'London'),
('Florence', 'Jones', 'florence@test.com', 'hash', 'employee', '2025-12-01 09:00:00', 'London'),
('Geneva', 'Brown', 'geneva@test.com', 'hash', 'employee', '2025-11-01 09:00:00', 'London'),
('Hugh', 'White', 'hugh@test.com', 'hash', 'admin', '2025-11-01 09:00:00', 'London');

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
('Board Games & Chill', 'Bring your favourite board game and meet new people.', 'Board games', 'Manchester', '2026-04-13', '2026-01-01 09:00:00'),
('Beginner Yoga Session', 'Relaxing yoga session for all levels.', 'Yoga', 'Fully remote', '2026-04-25', '2026-01-01 09:00:00'),
('Travel Talk Meetup', 'Share travel stories and plan future trips.', 'Travel', 'Fully remote', '2026-04-27', '2026-01-01 09:00:00');

INSERT INTO event_registrations (user_email, event_id, status) VALUES
-- Alice
('alice@test.com', 1, 'attended'),
('alice@test.com', 2, 'registered'),
('alice@test.com', 5, 'attended'),

-- Bob
('bob@test.com', 3, 'registered'),
('bob@test.com', 2, 'attended'),
('bob@test.com', 4, 'registered'),

-- Charlie
('charlie@test.com', 1, 'attended'),
('charlie@test.com', 5, 'registered'),
('charlie@test.com', 3, 'declined'),

-- Dana
('dana@test.com', 4, 'registered'),
('dana@test.com', 5, 'registered'),
('dana@test.com', 2, 'attended'),

-- Edward
('edward@test.com', 1, 'registered'),
('edward@test.com', 3, 'attended'),
('edward@test.com', 4, 'unresponsive'),

-- Florence
('florence@test.com', 2, 'registered'),
('florence@test.com', 5, 'attended'),
('florence@test.com', 1, 'cancelled');


INSERT INTO feedback (user_email, event_id, rating, comment) VALUES

-- Morning Running Club (id = 1)
('alice@test.com', 1, 5, 'Great energy and a really friendly group.'),
('charlie@test.com', 1, 4, 'Good pace, would join again.'),

-- Film Night Social (id = 2)
('alice@test.com', 2, 4, 'Nice selection of films and good discussion afterwards.'),
('bob@test.com', 2, 5, 'Really well organised, loved the atmosphere.'),
('dana@test.com', 2, 4, 'Fun evening, will come back.'),

-- Board Games & Chill (id = 3)
('bob@test.com', 3, 5, 'Super fun, lots of games to choose from.'),
('charlie@test.com', 3, 3, 'Good idea but a bit crowded.'),
('edward@test.com', 3, 4, 'Enjoyed meeting new people.'),

-- Beginner Yoga Session (id = 4)
('bob@test.com', 4, 4, 'Relaxing and easy to follow.'),
('dana@test.com', 4, 5, 'Perfect session for unwinding.'),
('edward@test.com', 4, 3, 'A bit slow for my pace but still good.'),

-- Travel Talk Meetup (id = 5)
('alice@test.com', 5, 5, 'Loved hearing everyone’s travel stories.'),
('charlie@test.com', 5, 4, 'Inspiring and fun group.'),
('dana@test.com', 5, 5, 'Great for sharing ideas and meeting people.'),
('florence@test.com', 5, 4, 'Really enjoyable and friendly crowd.');

-- Remainder of 100 new users

INSERT INTO users (first_name, last_name, email, password_hash, job_role, created_at, office_location) VALUES
('Liam','Taylor','liam.taylor@test.com','hash','employee','2025-09-05 09:00:00', 'London'),
('Olivia','Wilson','olivia.wilson@test.com','hash','employee','2025-09-06 10:00:00', 'London'),
('Noah','Davies','noah.davies@test.com','hash','employee','2025-09-07 11:00:00', 'London'),
('Amelia','Evans','amelia.evans@test.com','hash','employee','2025-09-08 09:30:00', 'London'),
('Oliver','Thomas','oliver.thomas@test.com','hash','employee','2025-09-09 08:45:00', 'London'),
('Isla','Roberts','isla.roberts@test.com','hash','employee','2025-09-10 14:00:00', 'London'),
('George','Johnson','george.johnson@test.com','hash','employee','2025-09-11 12:15:00', 'London'),
('Ava','Lewis','ava.lewis@test.com','hash','employee','2025-09-12 13:20:00', 'London'),
('Harry','Walker','harry.walker@test.com','hash','employee','2025-09-13 09:50:00', 'London'),
('Mia','Wright','mia.wright@test.com','hash','employee','2025-09-14 16:10:00', 'London'),

('Jack','Hall','jack.hall@test.com','hash','employee','2025-09-15 11:00:00', 'Manchester'),
('Sophia','Allen','sophia.allen@test.com','hash','employee','2025-09-16 10:30:00', 'Manchester'),
('Charlie','Young','charlie.young@test.com','hash','employee','2025-09-17 15:00:00', 'Manchester'),
('Grace','King','grace.king@test.com','hash','employee','2025-09-18 09:00:00', 'Manchester'),
('Jacob','Scott','jacob.scott@test.com','hash','employee','2025-09-19 13:40:00', 'Manchester'),
('Freya','Green','freya.green@test.com','hash','employee','2025-09-20 14:25:00', 'Manchester'),
('Thomas','Baker','thomas.baker@test.com','hash','employee','2025-09-21 12:00:00', 'Manchester'),
('Emily','Adams','emily.adams@test.com','hash','employee','2025-09-22 10:10:00', 'Manchester'),
('Oscar','Nelson','oscar.nelson@test.com','hash','employee','2025-09-23 11:20:00', 'Manchester'),
('Ella','Carter','ella.carter@test.com','hash','employee','2025-09-24 09:35:00', 'Manchester'),

('James','Mitchell','james.mitchell@test.com','hash','employee','2025-10-01 10:00:00', 'Manchester'),
('Sophie','Perez','sophie.perez@test.com','hash','employee','2025-10-02 11:00:00', 'Manchester'),
('William','Robinson','william.robinson@test.com','hash','employee','2025-10-03 12:00:00', 'Manchester'),
('Lily','Turner','lily.turner@test.com','hash','employee','2025-10-04 09:00:00', 'Manchester'),
('Henry','Phillips','henry.phillips@test.com','hash','employee','2025-10-05 13:00:00', 'Manchester'),
('Chloe','Campbell','chloe.campbell@test.com','hash','employee','2025-10-06 14:00:00', 'Manchester'),
('Leo','Parker','leo.parker@test.com','hash','employee','2025-10-07 15:00:00', 'Manchester'),
('Evie','Edwards','evie.edwards@test.com','hash','employee','2025-10-08 10:00:00', 'Manchester'),
('Alfie','Collins','alfie.collins@test.com','hash','employee','2025-10-09 11:30:00', 'Manchester'),
('Ruby','Stewart','ruby.stewart@test.com','hash','employee','2025-10-10 12:45:00', 'Manchester'),

('Joshua','Sanchez','joshua.sanchez@test.com','hash','employee','2025-10-11 09:15:00', 'Birmingham'),
('Isabella','Morris','isabella.morris@test.com','hash','employee','2025-10-12 10:25:00', 'Birmingham'),
('Daniel','Rogers','daniel.rogers@test.com','hash','employee','2025-10-13 11:35:00', 'Birmingham'),
('Poppy','Reed','poppy.reed@test.com','hash','employee','2025-10-14 12:45:00', 'Birmingham'),
('Max','Cook','max.cook@test.com','hash','employee','2025-10-15 13:55:00', 'Birmingham'),
('Sienna','Morgan','sienna.morgan@test.com','hash','employee','2025-10-16 14:05:00', 'Birmingham'),
('Logan','Bell','logan.bell@test.com','hash','employee','2025-10-17 15:15:00', 'Birmingham'),
('Rosie','Murphy','rosie.murphy@test.com','hash','employee','2025-10-18 16:25:00', 'Birmingham'),
('Ethan','Bailey','ethan.bailey@test.com','hash','employee','2025-10-19 09:45:00', 'Birmingham'),
('Zoe','Rivera','zoe.rivera@test.com','hash','employee','2025-10-20 10:55:00', 'Birmingham'),

('Mason','Cooper','mason.cooper@test.com','hash','employee','2025-11-01 09:00:00', 'Birmingham'),
('Layla','Richardson','layla.richardson@test.com','hash','employee','2025-11-02 10:00:00', 'Birmingham'),
('Lucas','Cox','lucas.cox@test.com','hash','employee','2025-11-03 11:00:00', 'Birmingham'),
('Hannah','Howard','hannah.howard@test.com','hash','employee','2025-11-04 12:00:00', 'Birmingham'),
('Sebastian','Ward','sebastian.ward@test.com','hash','employee','2025-11-05 13:00:00', 'Birmingham'),
('Aria','Torres','aria.torres@test.com','hash','employee','2025-11-06 14:00:00', 'Birmingham'),
('Aiden','Peterson','aiden.peterson@test.com','hash','employee','2025-11-07 15:00:00', 'Birmingham'),
('Scarlett','Gray','scarlett.gray@test.com','hash','employee','2025-11-08 16:00:00', 'Birmingham'),
('Elijah','Ramirez','elijah.ramirez@test.com','hash','employee','2025-11-09 09:30:00', 'Birmingham'),
('Penelope','James','penelope.james@test.com','hash','employee','2025-11-10 10:30:00', 'Birmingham'),

('Benjamin','Watson','benjamin.watson@test.com','hash','employee','2025-12-01 09:00:00', 'Edinburgh'),
('Nora','Brooks','nora.brooks@test.com','hash','employee','2025-12-02 10:00:00', 'Edinburgh'),
('Alexander','Kelly','alexander.kelly@test.com','hash','employee','2025-12-03 11:00:00', 'Edinburgh'),
('Mila','Sanders','mila.sanders@test.com','hash','employee','2025-12-04 12:00:00', 'Edinburgh'),
('Jackson','Price','jackson.price@test.com','hash','employee','2025-12-05 13:00:00', 'Edinburgh'),
('Luna','Bennett','luna.bennett@test.com','hash','employee','2025-12-06 14:00:00', 'Edinburgh'),
('David','Wood','david.wood@test.com','hash','employee','2025-12-07 15:00:00', 'Edinburgh'),
('Eleanor','Barnes','eleanor.barnes@test.com','hash','employee','2025-12-08 16:00:00', 'Edinburgh'),
('Joseph','Ross','joseph.ross@test.com','hash','employee','2025-12-09 09:30:00', 'Edinburgh'),
('Violet','Henderson','violet.henderson@test.com','hash','employee','2025-12-10 10:30:00', 'Edinburgh'),

('Samuel','Coleman','samuel.coleman@test.com','hash','employee','2026-01-01 09:00:00', 'Fully Remote'),
('Aurora','Jenkins','aurora.jenkins@test.com','hash','employee','2026-01-02 10:00:00', 'Fully Remote'),
('Carter','Perry','carter.perry@test.com','hash','employee','2026-01-03 11:00:00', 'Fully Remote'),
('Savannah','Powell','savannah.powell@test.com','hash','employee','2026-01-04 12:00:00', 'Fully Remote'),
('Owen','Long','owen.long@test.com','hash','employee','2026-01-05 13:00:00', 'Fully Remote'),
('Stella','Patterson','stella.patterson@test.com','hash','employee','2026-01-06 14:00:00', 'Fully Remote'),
('Wyatt','Hughes','wyatt.hughes@test.com','hash','employee','2026-01-07 15:00:00', 'Fully Remote'),
('Hazel','Flores','hazel.flores@test.com','hash','employee','2026-01-08 16:00:00', 'Fully Remote'),
('Gabriel','Washington','gabriel.washington@test.com','hash','employee','2026-01-09 09:30:00', 'Fully Remote'),
('Ellie','Butler','ellie.butler@test.com','hash','employee','2026-01-10 10:30:00', 'Fully Remote'),

('Isaac','Simmons','isaac.simmons@test.com','hash','employee','2026-02-01 09:00:00', 'Fully Remote'),
('Lucy','Foster','lucy.foster@test.com','hash','employee','2026-02-02 10:00:00', 'Fully Remote'),
('Jayden','Gonzalez','jayden.gonzalez@test.com','hash','employee','2026-02-03 11:00:00', 'Fully Remote'),
('Anna','Bryant','anna.bryant@test.com','hash','employee','2026-02-04 12:00:00', 'Fully Remote'),
('Anthony','Alexander','anthony.alexander@test.com','hash','employee','2026-02-05 13:00:00', 'Fully Remote'),
('Leah','Russell','leah.russell@test.com','hash','employee','2026-02-06 14:00:00', 'Fully Remote'),
('Dylan','Griffin','dylan.griffin@test.com','hash','employee','2026-02-07 15:00:00', 'Fully Remote'),
('Lila','Diaz','lila.diaz@test.com','hash','employee','2026-02-08 16:00:00', 'Fully Remote'),
('Luke','Hayes','luke.hayes@test.com','hash','employee','2026-02-09 09:30:00', 'Fully Remote'),
('Madison','Myers','madison.myers@test.com','hash','employee','2026-02-10 10:30:00', 'Fully Remote'),

('Nathan','Ford','nathan.ford@test.com','hash','employee','2026-03-01 09:00:00', 'Fully Remote'),
('Willow','Hamilton','willow.hamilton@test.com','hash','employee','2026-03-02 10:00:00', 'Fully Remote'),
('Aaron','Graham','aaron.graham@test.com','hash','employee','2026-03-03 11:00:00', 'Fully Remote'),
('Aubrey','Sullivan','aubrey.sullivan@test.com','hash','employee','2026-03-04 12:00:00', 'Fully Remote'),
('Caleb','Wallace','caleb.wallace@test.com','hash','employee','2026-03-05 13:00:00', 'Fully Remote'),
('Holly','Woods','holly.woods@test.com','hash','employee','2026-03-06 14:00:00', 'Fully Remote'),
('Ryan','Cole','ryan.cole@test.com','hash','employee','2026-03-07 15:00:00', 'Fully Remote'),
('Georgia','West','georgia.west@test.com','hash','employee','2026-03-08 16:00:00', 'Fully Remote'),
('Evan','Jordan','evan.jordan@test.com','hash','employee','2026-03-09 09:30:00', 'Fully Remote'),
('Darcie','Owens','darcie.owens@test.com','hash','employee','2026-03-10 10:30:00', 'Fully Remote'),

('Finn','Reynolds','finn.reynolds@test.com','hash','employee','2026-04-01 09:00:00', 'Fully Remote'),
('Imogen','Fisher','imogen.fisher@test.com','hash','employee','2026-04-02 10:00:00', 'Fully Remote'),
('Blake','Ellis','blake.ellis@test.com','hash','employee','2026-04-03 11:00:00', 'Fully Remote'),
('Esme','Harrison','esme.harrison@test.com','hash','employee','2026-04-04 12:00:00', 'Fully Remote'),
('Rory','Gibson','rory.gibson@test.com','hash','employee','2026-04-05 13:00:00', 'Fully Remote'),
('Maya','Mcdonald','maya.mcdonald@test.com','hash','employee','2026-04-06 14:00:00', 'Fully Remote'),
('Kai','Cruz','kai.cruz@test.com','hash','employee','2026-04-07 15:00:00', 'Fully Remote'),
('Eliza','Marshall','eliza.marshall@test.com','hash','employee','2026-04-08 16:00:00', 'Fully Remote'),
('Theo','Ortiz','theo.ortiz@test.com','hash','employee','2026-04-09 09:30:00', 'Fully Remote'),
('Ivy','Gomez','ivy.gomez@test.com','hash','employee','2026-04-10 10:30:00', 'Fully Remote');

INSERT INTO user_interests (user_email, interest_name) VALUES
('liam.taylor@test.com','Running'),
('liam.taylor@test.com','Cycling'),
('liam.taylor@test.com','Hiking'),

('olivia.wilson@test.com','Reading'),
('olivia.wilson@test.com','Film'),
('olivia.wilson@test.com','Music'),

('noah.davies@test.com','Gaming'),
('noah.davies@test.com','Chess'),
('noah.davies@test.com','Board games'),

('amelia.evans@test.com','Yoga'),
('amelia.evans@test.com','Photography'),
('amelia.evans@test.com','Travel'),

('oliver.thomas@test.com','Running'),
('oliver.thomas@test.com','Cycling'),
('oliver.thomas@test.com','Hiking'),
('oliver.thomas@test.com','Travel'),

('isla.roberts@test.com','Cooking'),
('isla.roberts@test.com','Reading'),
('isla.roberts@test.com','Film'),

('george.johnson@test.com','Gaming'),
('george.johnson@test.com','Board games'),
('george.johnson@test.com','Chess'),

('ava.lewis@test.com','Yoga'),
('ava.lewis@test.com','Music'),
('ava.lewis@test.com','Reading'),

('harry.walker@test.com','Running'),
('harry.walker@test.com','Cycling'),
('harry.walker@test.com','Hiking'),

('mia.wright@test.com','Photography'),
('mia.wright@test.com','Travel'),
('mia.wright@test.com','Reading'),

('jack.hall@test.com','Gaming'),
('jack.hall@test.com','Film'),
('jack.hall@test.com','Music'),

('sophia.allen@test.com','Yoga'),
('sophia.allen@test.com','Cooking'),
('sophia.allen@test.com','Reading'),

('charlie.young@test.com','Board games'),
('charlie.young@test.com','Chess'),
('charlie.young@test.com','Gaming'),

('grace.king@test.com','Photography'),
('grace.king@test.com','Travel'),
('grace.king@test.com','Reading'),

('jacob.scott@test.com','Running'),
('jacob.scott@test.com','Cycling'),
('jacob.scott@test.com','Hiking'),

('freya.green@test.com','Yoga'),
('freya.green@test.com','Music'),
('freya.green@test.com','Reading'),

('thomas.baker@test.com','Cooking'),
('thomas.baker@test.com','Film'),
('thomas.baker@test.com','Travel'),

('emily.adams@test.com','Reading'),
('emily.adams@test.com','Photography'),
('emily.adams@test.com','Music'),

('oscar.nelson@test.com','Gaming'),
('oscar.nelson@test.com','Board games'),
('oscar.nelson@test.com','Chess'),

('ella.carter@test.com','Yoga'),
('ella.carter@test.com','Travel'),
('ella.carter@test.com','Reading'),

('james.mitchell@test.com','Running'),
('james.mitchell@test.com','Cycling'),
('james.mitchell@test.com','Hiking'),

('sophie.perez@test.com','Reading'),
('sophie.perez@test.com','Film'),
('sophie.perez@test.com','Music'),

('william.robinson@test.com','Gaming'),
('william.robinson@test.com','Chess'),
('william.robinson@test.com','Board games'),

('lily.turner@test.com','Yoga'),
('lily.turner@test.com','Photography'),
('lily.turner@test.com','Travel'),

('henry.phillips@test.com','Running'),
('henry.phillips@test.com','Cycling'),
('henry.phillips@test.com','Hiking'),

('chloe.campbell@test.com','Cooking'),
('chloe.campbell@test.com','Reading'),
('chloe.campbell@test.com','Film'),

('leo.parker@test.com','Gaming'),
('leo.parker@test.com','Board games'),
('leo.parker@test.com','Chess'),

('evie.edwards@test.com','Yoga'),
('evie.edwards@test.com','Music'),
('evie.edwards@test.com','Reading'),

('alfie.collins@test.com','Running'),
('alfie.collins@test.com','Cycling'),
('alfie.collins@test.com','Hiking'),

('ruby.stewart@test.com','Photography'),
('ruby.stewart@test.com','Travel'),
('ruby.stewart@test.com','Reading'),

('joshua.sanchez@test.com','Gaming'),
('joshua.sanchez@test.com','Film'),
('joshua.sanchez@test.com','Music'),

('isabella.morris@test.com','Yoga'),
('isabella.morris@test.com','Cooking'),
('isabella.morris@test.com','Reading'),

('daniel.rogers@test.com','Board games'),
('daniel.rogers@test.com','Chess'),
('daniel.rogers@test.com','Gaming'),

('poppy.reed@test.com','Photography'),
('poppy.reed@test.com','Travel'),
('poppy.reed@test.com','Reading'),

('max.cook@test.com','Running'),
('max.cook@test.com','Cycling'),
('max.cook@test.com','Hiking'),

('sienna.morgan@test.com','Yoga'),
('sienna.morgan@test.com','Music'),
('sienna.morgan@test.com','Reading'),

('logan.bell@test.com','Cooking'),
('logan.bell@test.com','Film'),
('logan.bell@test.com','Travel'),

('rosie.murphy@test.com','Reading'),
('rosie.murphy@test.com','Photography'),
('rosie.murphy@test.com','Music'),

('ethan.bailey@test.com','Gaming'),
('ethan.bailey@test.com','Board games'),
('ethan.bailey@test.com','Chess'),

('zoe.rivera@test.com','Yoga'),
('zoe.rivera@test.com','Travel'),
('zoe.rivera@test.com','Reading'),

('mason.cooper@test.com','Running'),
('mason.cooper@test.com','Cycling'),
('mason.cooper@test.com','Hiking'),

('layla.richardson@test.com','Reading'),
('layla.richardson@test.com','Film'),
('layla.richardson@test.com','Music'),

('lucas.cox@test.com','Gaming'),
('lucas.cox@test.com','Chess'),
('lucas.cox@test.com','Board games'),

('hannah.howard@test.com','Yoga'),
('hannah.howard@test.com','Photography'),
('hannah.howard@test.com','Travel'),

('sebastian.ward@test.com','Running'),
('sebastian.ward@test.com','Cycling'),
('sebastian.ward@test.com','Hiking'),

('aria.torres@test.com','Cooking'),
('aria.torres@test.com','Reading'),
('aria.torres@test.com','Film'),

('aiden.peterson@test.com','Gaming'),
('aiden.peterson@test.com','Board games'),
('aiden.peterson@test.com','Chess'),

('scarlett.gray@test.com','Yoga'),
('scarlett.gray@test.com','Music'),
('scarlett.gray@test.com','Reading'),

('elijah.ramirez@test.com','Running'),
('elijah.ramirez@test.com','Cycling'),
('elijah.ramirez@test.com','Hiking'),

('penelope.james@test.com','Photography'),
('penelope.james@test.com','Travel'),
('penelope.james@test.com','Reading'),

('benjamin.watson@test.com','Gaming'),
('benjamin.watson@test.com','Film'),
('benjamin.watson@test.com','Music'),

('nora.brooks@test.com','Yoga'),
('nora.brooks@test.com','Cooking'),
('nora.brooks@test.com','Reading'),

('alexander.kelly@test.com','Board games'),
('alexander.kelly@test.com','Chess'),
('alexander.kelly@test.com','Gaming'),

('mila.sanders@test.com','Photography'),
('mila.sanders@test.com','Travel'),
('mila.sanders@test.com','Reading'),

('jackson.price@test.com','Running'),
('jackson.price@test.com','Cycling'),
('jackson.price@test.com','Hiking'),

('luna.bennett@test.com','Yoga'),
('luna.bennett@test.com','Music'),
('luna.bennett@test.com','Reading'),

('david.wood@test.com','Cooking'),
('david.wood@test.com','Film'),
('david.wood@test.com','Travel'),

('eleanor.barnes@test.com','Reading'),
('eleanor.barnes@test.com','Photography'),
('eleanor.barnes@test.com','Music'),

('joseph.ross@test.com','Gaming'),
('joseph.ross@test.com','Board games'),
('joseph.ross@test.com','Chess'),

('violet.henderson@test.com','Yoga'),
('violet.henderson@test.com','Travel'),
('violet.henderson@test.com','Reading'),

('samuel.coleman@test.com','Running'),
('samuel.coleman@test.com','Cycling'),
('samuel.coleman@test.com','Hiking'),

('aurora.jenkins@test.com','Reading'),
('aurora.jenkins@test.com','Film'),
('aurora.jenkins@test.com','Music'),

('carter.perry@test.com','Gaming'),
('carter.perry@test.com','Chess'),
('carter.perry@test.com','Board games'),

('savannah.powell@test.com','Yoga'),
('savannah.powell@test.com','Photography'),
('savannah.powell@test.com','Travel'),

('owen.long@test.com','Running'),
('owen.long@test.com','Cycling'),
('owen.long@test.com','Hiking'),

('stella.patterson@test.com','Cooking'),
('stella.patterson@test.com','Reading'),
('stella.patterson@test.com','Film'),

('wyatt.hughes@test.com','Gaming'),
('wyatt.hughes@test.com','Board games'),
('wyatt.hughes@test.com','Chess'),

('hazel.flores@test.com','Yoga'),
('hazel.flores@test.com','Music'),
('hazel.flores@test.com','Reading'),

('gabriel.washington@test.com','Running'),
('gabriel.washington@test.com','Cycling'),
('gabriel.washington@test.com','Hiking'),

('ellie.butler@test.com','Photography'),
('ellie.butler@test.com','Travel'),
('ellie.butler@test.com','Reading'),

('isaac.simmons@test.com','Gaming'),
('isaac.simmons@test.com','Film'),
('isaac.simmons@test.com','Music'),

('lucy.foster@test.com','Yoga'),
('lucy.foster@test.com','Cooking'),
('lucy.foster@test.com','Reading'),

('jayden.gonzalez@test.com','Board games'),
('jayden.gonzalez@test.com','Chess'),
('jayden.gonzalez@test.com','Gaming'),

('anna.bryant@test.com','Photography'),
('anna.bryant@test.com','Travel'),
('anna.bryant@test.com','Reading'),

('anthony.alexander@test.com','Running'),
('anthony.alexander@test.com','Cycling'),
('anthony.alexander@test.com','Hiking'),

('leah.russell@test.com','Yoga'),
('leah.russell@test.com','Music'),
('leah.russell@test.com','Reading'),

('dylan.griffin@test.com','Cooking'),
('dylan.griffin@test.com','Film'),
('dylan.griffin@test.com','Travel'),

('lila.diaz@test.com','Reading'),
('lila.diaz@test.com','Photography'),
('lila.diaz@test.com','Music'),

('luke.hayes@test.com','Gaming'),
('luke.hayes@test.com','Board games'),
('luke.hayes@test.com','Chess'),

('madison.myers@test.com','Yoga'),
('madison.myers@test.com','Travel'),
('madison.myers@test.com','Reading'),

('nathan.ford@test.com','Running'),
('nathan.ford@test.com','Cycling'),
('nathan.ford@test.com','Hiking'),

('willow.hamilton@test.com','Reading'),
('willow.hamilton@test.com','Film'),
('willow.hamilton@test.com','Music'),

('aaron.graham@test.com','Gaming'),
('aaron.graham@test.com','Chess'),
('aaron.graham@test.com','Board games'),

('aubrey.sullivan@test.com','Yoga'),
('aubrey.sullivan@test.com','Photography'),
('aubrey.sullivan@test.com','Travel'),

('caleb.wallace@test.com','Running'),
('caleb.wallace@test.com','Cycling'),
('caleb.wallace@test.com','Hiking'),

('holly.woods@test.com','Cooking'),
('holly.woods@test.com','Reading'),
('holly.woods@test.com','Film'),

('ryan.cole@test.com','Gaming'),
('ryan.cole@test.com','Board games'),
('ryan.cole@test.com','Chess'),

('georgia.west@test.com','Yoga'),
('georgia.west@test.com','Music'),
('georgia.west@test.com','Reading'),

('evan.jordan@test.com','Running'),
('evan.jordan@test.com','Cycling'),
('evan.jordan@test.com','Hiking'),

('darcie.owens@test.com','Photography'),
('darcie.owens@test.com','Travel'),
('darcie.owens@test.com','Reading'),

('finn.reynolds@test.com','Running'),
('finn.reynolds@test.com','Cycling'),
('finn.reynolds@test.com','Hiking'),

('imogen.fisher@test.com','Reading'),
('imogen.fisher@test.com','Film'),
('imogen.fisher@test.com','Music'),

('blake.ellis@test.com','Gaming'),
('blake.ellis@test.com','Board games'),
('blake.ellis@test.com','Chess'),

('esme.harrison@test.com','Yoga'),
('esme.harrison@test.com','Photography'),
('esme.harrison@test.com','Travel'),

('rory.gibson@test.com','Running'),
('rory.gibson@test.com','Cycling'),
('rory.gibson@test.com','Hiking'),

('maya.mcdonald@test.com','Cooking'),
('maya.mcdonald@test.com','Reading'),
('maya.mcdonald@test.com','Music'),

('kai.cruz@test.com','Gaming'),
('kai.cruz@test.com','Chess'),
('kai.cruz@test.com','Board games'),

('eliza.marshall@test.com','Yoga'),
('eliza.marshall@test.com','Travel'),
('eliza.marshall@test.com','Reading'),

('theo.ortiz@test.com','Running'),
('theo.ortiz@test.com','Cycling'),
('theo.ortiz@test.com','Hiking'),

('ivy.gomez@test.com','Photography'),
('ivy.gomez@test.com','Reading'),
('ivy.gomez@test.com','Music');

INSERT INTO event_registrations (user_email, event_id, status) VALUES

-- Liam
('liam.taylor@test.com',1,'attended'),
('liam.taylor@test.com',4,'registered'),
('liam.taylor@test.com',5,'attended'),

-- Olivia
('olivia.wilson@test.com',2,'attended'),
('olivia.wilson@test.com',5,'registered'),

-- Noah
('noah.davies@test.com',3,'attended'),
('noah.davies@test.com',2,'registered'),

-- Amelia
('amelia.evans@test.com',4,'attended'),
('amelia.evans@test.com',5,'registered'),

-- Oliver
('oliver.thomas@test.com',1,'registered'),
('oliver.thomas@test.com',3,'attended'),
('oliver.thomas@test.com',5,'registered'),

-- Isla
('isla.roberts@test.com',2,'attended'),
('isla.roberts@test.com',4,'registered'),

-- George
('george.johnson@test.com',3,'attended'),
('george.johnson@test.com',1,'registered'),

-- Ava
('ava.lewis@test.com',4,'attended'),
('ava.lewis@test.com',2,'registered'),

-- Harry
('harry.walker@test.com',1,'attended'),
('harry.walker@test.com',5,'registered'),

-- Mia
('mia.wright@test.com',5,'attended'),
('mia.wright@test.com',2,'registered'),

-- Jack
('jack.hall@test.com',2,'attended'),
('jack.hall@test.com',3,'registered'),

-- Sophia
('sophia.allen@test.com',4,'attended'),
('sophia.allen@test.com',2,'registered'),

-- Charlie
('charlie.young@test.com',3,'attended'),
('charlie.young@test.com',1,'declined'),

-- Grace
('grace.king@test.com',5,'attended'),
('grace.king@test.com',2,'registered'),

-- Jacob
('jacob.scott@test.com',1,'attended'),
('jacob.scott@test.com',4,'registered'),

-- Freya
('freya.green@test.com',4,'attended'),
('freya.green@test.com',5,'registered'),

-- Thomas
('thomas.baker@test.com',2,'attended'),
('thomas.baker@test.com',5,'registered'),

-- Emily
('emily.adams@test.com',2,'attended'),
('emily.adams@test.com',5,'registered'),

-- Oscar
('oscar.nelson@test.com',3,'attended'),
('oscar.nelson@test.com',1,'registered'),

-- Ella
('ella.carter@test.com',4,'attended'),
('ella.carter@test.com',5,'registered'),

-- James
('james.mitchell@test.com',1,'attended'),
('james.mitchell@test.com',3,'registered'),

-- Sophie
('sophie.perez@test.com',2,'attended'),
('sophie.perez@test.com',5,'registered'),

-- William
('william.robinson@test.com',3,'attended'),
('william.robinson@test.com',2,'registered'),

-- Lily
('lily.turner@test.com',4,'attended'),
('lily.turner@test.com',5,'registered'),

-- Henry
('henry.phillips@test.com',1,'attended'),
('henry.phillips@test.com',4,'registered'),

-- Chloe
('chloe.campbell@test.com',2,'attended'),
('chloe.campbell@test.com',5,'registered'),

-- Leo
('leo.parker@test.com',3,'attended'),
('leo.parker@test.com',1,'registered'),

-- Evie
('evie.edwards@test.com',4,'attended'),
('evie.edwards@test.com',2,'registered'),

-- Alfie
('alfie.collins@test.com',1,'attended'),
('alfie.collins@test.com',3,'registered'),

-- Ruby
('ruby.stewart@test.com',5,'attended'),
('ruby.stewart@test.com',2,'registered'),

-- Joshua
('joshua.sanchez@test.com',2,'attended'),
('joshua.sanchez@test.com',3,'registered'),

-- Isabella
('isabella.morris@test.com',4,'attended'),
('isabella.morris@test.com',5,'registered'),

-- Daniel
('daniel.rogers@test.com',3,'attended'),
('daniel.rogers@test.com',1,'registered'),

-- Poppy
('poppy.reed@test.com',5,'attended'),
('poppy.reed@test.com',2,'registered'),

-- Max
('max.cook@test.com',1,'attended'),
('max.cook@test.com',4,'registered'),

-- Sienna
('sienna.morgan@test.com',4,'attended'),
('sienna.morgan@test.com',5,'registered'),

-- Logan
('logan.bell@test.com',2,'attended'),
('logan.bell@test.com',5,'registered'),

-- Rosie
('rosie.murphy@test.com',5,'attended'),
('rosie.murphy@test.com',2,'registered'),

-- Ethan
('ethan.bailey@test.com',3,'attended'),
('ethan.bailey@test.com',1,'registered'),

-- Zoe
('zoe.rivera@test.com',4,'attended'),
('zoe.rivera@test.com',5,'registered'),

-- Mason
('mason.cooper@test.com',1,'attended'),
('mason.cooper@test.com',3,'registered'),

-- Layla
('layla.richardson@test.com',2,'attended'),
('layla.richardson@test.com',5,'registered'),

-- Lucas
('lucas.cox@test.com',3,'attended'),
('lucas.cox@test.com',1,'registered'),

-- Hannah
('hannah.howard@test.com',4,'attended'),
('hannah.howard@test.com',5,'registered'),

-- Sebastian
('sebastian.ward@test.com',1,'attended'),
('sebastian.ward@test.com',4,'registered'),

-- Aria
('aria.torres@test.com',2,'attended'),
('aria.torres@test.com',5,'registered'),

-- Aiden
('aiden.peterson@test.com',3,'attended'),
('aiden.peterson@test.com',1,'registered'),

-- Scarlett
('scarlett.gray@test.com',4,'attended'),
('scarlett.gray@test.com',2,'registered'),

-- Elijah
('elijah.ramirez@test.com',1,'attended'),
('elijah.ramirez@test.com',3,'registered'),

-- Penelope
('penelope.james@test.com',5,'attended'),
('penelope.james@test.com',2,'registered'),

-- Benjamin
('benjamin.watson@test.com',2,'attended'),
('benjamin.watson@test.com',3,'registered'),

-- Nora
('nora.brooks@test.com',4,'attended'),
('nora.brooks@test.com',5,'registered'),

-- Alexander
('alexander.kelly@test.com',3,'attended'),
('alexander.kelly@test.com',1,'registered'),

-- Mila
('mila.sanders@test.com',5,'attended'),
('mila.sanders@test.com',2,'registered'),

-- Jackson
('jackson.price@test.com',1,'attended'),
('jackson.price@test.com',4,'registered'),

-- Luna
('luna.bennett@test.com',4,'attended'),
('luna.bennett@test.com',5,'registered'),

-- David
('david.wood@test.com',2,'attended'),
('david.wood@test.com',5,'registered'),

-- Eleanor
('eleanor.barnes@test.com',5,'attended'),
('eleanor.barnes@test.com',2,'registered'),

-- Joseph
('joseph.ross@test.com',3,'attended'),
('joseph.ross@test.com',1,'registered'),

-- Violet
('violet.henderson@test.com',4,'attended'),
('violet.henderson@test.com',5,'registered'),

-- Samuel
('samuel.coleman@test.com',1,'attended'),
('samuel.coleman@test.com',3,'registered'),

-- Aurora
('aurora.jenkins@test.com',2,'attended'),
('aurora.jenkins@test.com',5,'registered'),

-- Carter
('carter.perry@test.com',3,'attended'),
('carter.perry@test.com',1,'registered'),

-- Savannah
('savannah.powell@test.com',4,'attended'),
('savannah.powell@test.com',5,'registered'),

-- Owen
('owen.long@test.com',1,'attended'),
('owen.long@test.com',4,'registered'),

-- Stella
('stella.patterson@test.com',2,'attended'),
('stella.patterson@test.com',5,'registered'),

-- Wyatt
('wyatt.hughes@test.com',3,'attended'),
('wyatt.hughes@test.com',1,'registered'),

-- Hazel
('hazel.flores@test.com',4,'attended'),
('hazel.flores@test.com',2,'registered'),

-- Gabriel
('gabriel.washington@test.com',1,'attended'),
('gabriel.washington@test.com',3,'registered'),

-- Ellie
('ellie.butler@test.com',5,'attended'),
('ellie.butler@test.com',2,'registered'),

-- Isaac
('isaac.simmons@test.com',2,'attended'),
('isaac.simmons@test.com',3,'registered'),

-- Lucy
('lucy.foster@test.com',4,'attended'),
('lucy.foster@test.com',5,'registered'),

-- Jayden
('jayden.gonzalez@test.com',3,'attended'),
('jayden.gonzalez@test.com',1,'registered'),

-- Anna
('anna.bryant@test.com',5,'attended'),
('anna.bryant@test.com',2,'registered'),

-- Anthony
('anthony.alexander@test.com',1,'attended'),
('anthony.alexander@test.com',4,'registered'),

-- Leah
('leah.russell@test.com',4,'attended'),
('leah.russell@test.com',5,'registered'),

-- Dylan
('dylan.griffin@test.com',2,'attended'),
('dylan.griffin@test.com',5,'registered'),

-- Lila
('lila.diaz@test.com',5,'attended'),
('lila.diaz@test.com',2,'registered'),

-- Luke
('luke.hayes@test.com',3,'attended'),
('luke.hayes@test.com',1,'registered'),

-- Madison
('madison.myers@test.com',4,'attended'),
('madison.myers@test.com',5,'registered'),

-- Nathan
('nathan.ford@test.com',1,'attended'),
('nathan.ford@test.com',3,'registered'),

-- Willow
('willow.hamilton@test.com',2,'attended'),
('willow.hamilton@test.com',5,'registered'),

-- Aaron
('aaron.graham@test.com',3,'attended'),
('aaron.graham@test.com',1,'registered'),

-- Aubrey
('aubrey.sullivan@test.com',4,'attended'),
('aubrey.sullivan@test.com',5,'registered'),

-- Caleb
('caleb.wallace@test.com',1,'attended'),
('caleb.wallace@test.com',4,'registered'),

-- Holly
('holly.woods@test.com',2,'attended'),
('holly.woods@test.com',5,'registered'),

-- Ryan
('ryan.cole@test.com',3,'attended'),
('ryan.cole@test.com',1,'registered'),

-- Georgia
('georgia.west@test.com',4,'attended'),
('georgia.west@test.com',2,'registered'),

-- Evan
('evan.jordan@test.com',1,'attended'),
('evan.jordan@test.com',3,'registered'),

-- Darcie
('darcie.owens@test.com',5,'attended'),
('darcie.owens@test.com',2,'registered'),

-- Finn
('finn.reynolds@test.com',1,'attended'),
('finn.reynolds@test.com',4,'registered'),

-- Imogen
('imogen.fisher@test.com',2,'attended'),
('imogen.fisher@test.com',5,'registered'),

-- Blake
('blake.ellis@test.com',3,'attended'),
('blake.ellis@test.com',1,'registered'),

-- Esme
('esme.harrison@test.com',4,'attended'),
('esme.harrison@test.com',5,'registered'),

-- Rory
('rory.gibson@test.com',1,'attended'),
('rory.gibson@test.com',3,'registered'),

-- Maya
('maya.mcdonald@test.com',2,'attended'),
('maya.mcdonald@test.com',5,'registered'),

-- Kai
('kai.cruz@test.com',3,'attended'),
('kai.cruz@test.com',1,'registered'),

-- Eliza
('eliza.marshall@test.com',4,'attended'),
('eliza.marshall@test.com',5,'registered'),

-- Theo
('theo.ortiz@test.com',1,'attended'),
('theo.ortiz@test.com',3,'registered'),

-- Ivy
('ivy.gomez@test.com',5,'attended'),
('ivy.gomez@test.com',2,'registered');