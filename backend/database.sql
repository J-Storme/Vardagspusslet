-- users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
id SERIAL PRIMARY KEY,
household_username TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
email TEXT NOT NULL
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

--  events
DROP TABLE IF EXISTS events;
CREATE TABLE events (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT,
event_date DATE NOT NULL,
user_id INTEGER REFERENCES users(id), 
family_member_id INTEGER REFERENCES family_members(id), 
category_id INTEGER REFERENCES categories(id)  
);

-- event_categories, Om en händelse kan ha flera kategorier, eller om man vill kunna tilldela flera kategorier till en händelse
DROP TABLE IF EXISTS event_categories;
CREATE TABLE event_categories (
event_id INTEGER REFERENCES events(id),
category_id INTEGER REFERENCES categories(id),
PRIMARY KEY (event_id, category_id)
);

-- tasks, uppgifter som även kan vara kopplade till händelser
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT,
due_date DATE, 
completed BOOLEAN DEFAULT FALSE, 
event_id INTEGER REFERENCES events(id), 
family_member_id INTEGER REFERENCES family_members(id) 
);