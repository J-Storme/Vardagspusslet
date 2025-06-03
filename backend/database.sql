-- users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
email TEXT NOT NULL,
token TEXT
);

-- family_members
DROP TABLE IF EXISTS family_members;
CREATE TABLE family_members (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),  
name TEXT NOT NULL,
role TEXT NOT NULL,   
profile_image TEXT   
);

-- categories
DROP TABLE IF EXISTS categories; 
CREATE TABLE categories (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
color TEXT DEFAULT '#000000',  
icon TEXT 
);

INSERT INTO categories (name, color) VALUES
('Läxor', '#FF5733'),
('Träning', '#33FF57'),
('Städning', '#3357FF');

--  events
DROP TABLE IF EXISTS events;
CREATE TABLE events (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT,
event_date DATE NOT NULL,
start_time TIME,
end_time TIME,
user_id INTEGER REFERENCES users(id), 
family_member_id INTEGER REFERENCES family_members(id), 
category_id INTEGER REFERENCES categories(id)  
);

-- tasks, uppgifter som även kan vara kopplade till händelser
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT,
due_date DATE, 
completed BOOLEAN DEFAULT FALSE, 
recurring_weekday INTEGER,
event_id INTEGER REFERENCES events(id), 
user_id INTEGER REFERENCES users(id),
category_id INTEGER REFERENCES categories(id)
);

-- kopllingstabell för att kunna koppla flera veckodagar till uppgift
DROP TABLE IF EXISTS task_weekdays;
CREATE TABLE task_weekdays (
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  weekday INTEGER NOT NULL CHECK (weekday BETWEEN 1 AND 7),
  PRIMARY KEY (task_id, weekday)
);

-- kopplingstabell tasks_family_members (flera familjemedlemmar kan kopplas till en uppgift)
--On Delete cascade = Om den refererade raden tas bort, så tas automatiskt alla kopplade rader i denna tabell bort.
DROP TABLE IF EXISTS task_family_members;
CREATE TABLE task_family_members (
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  family_member_id INTEGER REFERENCES family_members(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, family_member_id)
);

-- kopplingstabell event_family_members (flera familjemedlemmar kan kopplas till ett event)
DROP TABLE IF EXISTS event_family_members;
CREATE TABLE event_family_members (
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  family_member_id INTEGER REFERENCES family_members(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, family_member_id)
);