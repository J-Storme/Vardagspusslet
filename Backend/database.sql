--  events
CREATE TABLE IF NOT EXISTS events (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT,
event_date DATE NOT NULL,
user_id INTEGER REFERENCES users(id),   -- Vem händelsen tillhör (för systemadministration)
family_member_id INTEGER REFERENCES family_members(id),  -- Vilken familjemedlem uppgiften tillhör
category_id INTEGER REFERENCES categories(id)  -- Kategorin för händelsen
);

-- users
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
household_username TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
email TEXT NOT NULL
);

-- family_members
CREATE TABLE IF NOT EXISTS family_members (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),  -- Kopplad till hushåll
name TEXT NOT NULL,
profile_image TEXT,   -- Eventuellt en bild av familjemedlemmen
);

-- categories
CREATE TABLE IF NOT EXISTS categories (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
color TEXT DEFAULT '#000000',  
icon TEXT                     -- Ikon eller bild
);

-- event_categories, Om en händelse kan ha flera kategorier, eller om man vill kunna tilldela flera kategorier till en händelse
CREATE TABLE IF NOT EXISTS event_categories (
event_id INTEGER REFERENCES events(id),
category_id INTEGER REFERENCES categories(id),
PRIMARY KEY (event_id, category_id)
);

-- tasks, uppgifter som även kan vara kopplade till händelser
CREATE TABLE IF NOT EXISTS tasks (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT,
due_date DATE,                   -- Påminnelse innan detta datum
completed BOOLEAN DEFAULT FALSE,  -- Om uppgiften är avklarad
event_id INTEGER REFERENCES events(id), -- Om kopplad till händelse
family_member_id INTEGER REFERENCES family_members(id)  -- Familjemedlem som uppgiften gäller
);