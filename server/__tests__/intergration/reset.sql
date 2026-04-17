-- RESET DATABASE

TRUNCATE TABLE
  event_registrations,
  feedback,
  user_interests,
  events,
  insights,
  interests,
  users
RESTART IDENTITY CASCADE;