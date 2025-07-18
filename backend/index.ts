import express, { Request, Response, NextFunction } from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
//import type { User, Task, FamilyMember, Category, Event } from './types';

interface UserRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    token?: string;
  };
}

// Läs in miljövariabler från .env-fil
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// middleware som löser cors
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json()); // middleware för att tolka JSON-body

// Anslut till PostgreSQL-databas
const client = new Client({
  connectionString: process.env.PGURI,
  ssl: { rejectUnauthorized: false },
});
//console.log('PGURI:', process.env.PGURI);
//console.log('PGSSLMODE:', process.env.PGSSLMODE);
client.connect();

// Middleware för att autentisera token
async function authenticate(
  request: UserRequest,
  response: Response,
  next: NextFunction,
) {
  // Hämta token från query-parametern eller authorization-headren
  let token = (request.query.token as string) || request.headers.authorization;

  if (token && token?.startsWith('Bearer ')) {
    token = token.slice(7); // Tar bort "Bearer "
  }

  //console.log('Token:', token);

  if (!token) {
    response.status(401).json({ error: 'Token saknas' });
    return;
  }

  try {
    // Hämta användaren baserat på token
    const result = await client.query('SELECT * FROM users WHERE token = $1', [
      token,
    ]);
    const user = result.rows[0];

    if (!user) {
      response.status(401).json({ error: 'Ogiltig token' });
      return;
    }

    // Spara användaren i request-objektet
    (request as UserRequest).user = {
      id: user.id,
      email: user.email,
      name: user.name,
      token: user.token,
    };

    next(); // Släpp vidare till nästa middleware eller route
  } catch (error) {
    console.error('Fel vid autentisering:', error);
    response.status(500).json({ error: 'Serverfel vid autentisering' });
  }
}

/*
// GET
app.get('/', (_request, response) => {
  response.send('root');
});
*/

// GET api
app.get('/api', (_request, response) => {
  response.send({ test: 'test' });
});

// POST registera användare
app.post('/api/register', async (request, response) => {
  const { email, password, name } = request.body;
  const token = uuidv4();

  try {
    // Kontrollera om användaren redan finns i databasen
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    if (existingUser.rows.length > 0) {
      response.status(400).json({ error: 'E-postadress är redan registrerad' });
      return;
    }

    // Sätt in den nya användaren i databasen
    await client.query(
      'INSERT INTO users (token, email, password, name) VALUES ($1, $2, $3, $4)',
      [token, email, password, name],
    );

    // Hämta den nya användaren
    const selectResult = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    const newUser = selectResult.rows[0];

    return response.status(201).json({
      message: 'Registrering lyckades',
      token: newUser.token,
      name: newUser.name,
      email: newUser.email,
      id: newUser.id,
    });
  } catch (error) {
    console.error('Fel vid registrering:', error);
    return response
      .status(500)
      .json({ error: 'Kunde inte registrera användare' });
  }
});

// POST login
app.post('/api/login', async (request, response) => {
  const { email, password } = request.body;

  // hämta en user från databas där email är samma som skrivs in
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    const user = result.rows[0];

    if (!user || password !== user.password) {
      response.status(401).json({ error: 'Fel e-post eller lösenord' });
      return;
    }

    // Skapa en token
    const token = uuidv4();

    // Uppdatera token i databasen
    await client.query('UPDATE users SET token = $1 WHERE id = $2', [
      token,
      user.id,
    ]);

    response.json({
      message: 'Inloggad',
      token,
      email: user.email,
      name: user.name,
      id: user.id,
    });
  } catch (error) {
    console.error('Fel vid inloggning:', error);
    response.status(500).json({ error: 'Något gick fel vid inloggning' });
  }
});

// GET user
app.get('/api/user', authenticate, async (request, response) => {
  const userId = (request as UserRequest).user?.id;

  try {
    const result = await client.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [userId],
    );

    if (result.rows.length === 0) {
      response.status(404).json({ error: 'Användare hittades inte' });
      return;
    }

    response.json(result.rows[0]);
  } catch (error) {
    console.error('Fel vid hämtning av användare:', error);
    response.status(500).json({ error: 'Serverfel' });
  }
});

// GET api Hämta familjemedlemmar
app.get('/api/family-members', authenticate, async (request, response) => {
  const userId = (request as UserRequest).user?.id;

  //console.log('Familjemedlemmar för användare:', userId);

  try {
    const result = await client.query(
      'SELECT * FROM family_members WHERE user_id = $1',
      [userId],
    );

    response.json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Kunde inte hämta familjemedlemmar.' });
  }
});

// POST Lägga till familjemedlem
app.post('/api/family-members', authenticate, async (request, response) => {
  const { name, role, profile_image } = request.body;
  const userId = (request as UserRequest).user?.id;

  try {
    const result = await client.query(
      'INSERT INTO family_members (user_id, name, role, profile_image) VALUES ($1, $2, $3, $4) RETURNING *',
      //returning skickar tillbaka den senaste inserten
      [userId, name, role, profile_image || null],
    );

    response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Kunde inte spara familjemedlem.' });
  }
});

// PUT redigera familjemedlem
app.put('/api/family-members/:id', async function (request, response) {
  // Hämta ID från URL:en
  const familyMemberId = request.params.id;

  // Hämta de nya värdena från body
  const name = request.body.name;
  const role = request.body.role;
  const profile_image = request.body.profile_image;

  try {
    // Kontrollera om familjemedlemmen finns
    const checkResult = await client.query(
      'SELECT * FROM family_members WHERE id = $1',
      [familyMemberId],
    );

    if (checkResult.rows.length === 0) {
      response.status(404).json({ error: 'Familjemedlem hittades inte' });
      return;
    }

    // Uppdatera familjemedlemmen i databasen
    await client.query(
      'UPDATE family_members SET name = $1, role = $2, profile_image = $3 WHERE id = $4',
      [name, role, profile_image || null, familyMemberId],
    );

    response.status(200).json({ message: 'Familjemedlem uppdaterad' });
  } catch (error) {
    console.error('Fel vid uppdatering av familjemedlem:', error);
    response.status(500).json({ error: 'Kunde inte uppdatera familjemedlem' });
  }
});

// DELETE Ta bort familjemedlem
app.delete('/api/family-members/:id', async function (request, response) {
  // Hämta id på familjemedlem från URL:en
  const familyMemberId = request.params.id;

  try {
    // Kontrollera om familjemedlemmen finns
    const checkResult = await client.query(
      'SELECT * FROM family_members WHERE id = $1',
      [familyMemberId],
    );

    // Om ingen familjemedlem hittades, skicka felmeddelande
    if (checkResult.rows.length === 0) {
      response.status(404).json({ error: 'Familjemedlem hittades inte' });
      return;
    }

    // Radera familjemedlemmen från databasen
    await client.query('DELETE FROM family_members WHERE id = $1', [
      familyMemberId,
    ]);

    // Skicka bekräftelse till klienten
    response.status(200).json({ message: 'Familjemedlem togs bort' });
  } catch (error) {
    console.error('Fel vid borttagning av familjemedlem:', error);
    response.status(500).json({ error: 'Kunde inte ta bort familjemedlem' });
  }
});

// POST Logout
app.post('/logout', authenticate, async (request, response) => {
  const token = (request as UserRequest).user?.token;

  try {
    // Loggar ut genom att sätta token till null
    await client.query('UPDATE users SET token = NULL WHERE token = $1', [
      token,
    ]);

    response.status(200).json({ message: 'Utloggad' });
  } catch (error) {
    console.error('Fel vid utloggning:', error);
    response.status(500).json({ error: 'Kunde inte logga ut' });
  }
});

// GET tasks
app.get('/api/tasks', authenticate, async (request, response) => {
  const userId = (request as UserRequest).user?.id;

  if (!userId) {
    return response.status(401).json({ error: 'Ej auktoriserad' });
  }

  try {
    // Hämta alla tasks som är kopplade till familjemedlemmar som tillhör användaren
    const tasksResult = await client.query(
      `SELECT DISTINCT tasks.*
      FROM tasks
      JOIN task_family_members tasksfamilym ON tasks.id = tasksfamilym.task_id
      JOIN family_members fm ON tasksfamilym.family_member_id = fm.id
      WHERE fm.user_id = $1
      ORDER BY tasks.due_date ASC`,
      [userId],
    );

    const tasks = tasksResult.rows;

    // Hämta familjemedlemmar kopplade till varje task
    for (const task of tasks) {
      const familyResult = await client.query(
        `SELECT family_members.id, family_members.name, family_members.role, family_members.profile_image
         FROM task_family_members
         JOIN family_members ON task_family_members.family_member_id = family_members.id
         WHERE task_family_members.task_id = $1`,
        [task.id],
      );

      // Spara id:n och hela familjemedlemsobjektet i task
      task.family_member_ids = familyResult.rows.map((row) => row.id);
      task.family_members = familyResult.rows;
    }

    // Skicka tillbaka tasks med familjemedlemmar
    response.json(tasks);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Kunde inte hämta tasks' });
  }
});

// POST tasks
app.post('/api/tasks', authenticate, async (request, response) => {
  // Hämta info som skickats in från frontend
  const { title, description, due_date, family_member_ids, event_id } =
    request.body;
  // Hämta användarens ID från request-objektet (som lades till i authenticate-middlewaret)
  const userId = (request as UserRequest).user?.id;

  try {
    // Kolla att familjemedlemmen tillhör användaren (om det finns family_member_ids)
    if (family_member_ids && family_member_ids.length > 0) {
      const checkFamilyMembers = await client.query(
        `SELECT id FROM family_members WHERE id = ANY($1) AND user_id = $2`,
        [family_member_ids, userId],
      );

      if (checkFamilyMembers.rows.length !== family_member_ids.length) {
        response.status(403).json({
          error: 'Familjemedlem tillhör inte din användare',
        });
        return;
      }
    }

    // Skapa uppgiften och få tillbaka den nyainsatta raden
    const insertTaskResult = await client.query(
      `INSERT INTO tasks (title, description, due_date, event_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, due_date || null, event_id || null],
    );

    // Spara den nyss skapade uppgiften
    const newTask = insertTaskResult.rows[0];

    // Lägg till kopplingar i task_family_members
    if (family_member_ids && family_member_ids.length > 0) {
      for (const familyMemberId of family_member_ids) {
        await client.query(
          `INSERT INTO task_family_members (task_id, family_member_id) VALUES ($1, $2)`,
          [newTask.id, familyMemberId],
        );
      }
    }

    // Hämta kopplade family_member_ids
    const familyMembersResult = await client.query(
      `SELECT family_member_id FROM task_family_members WHERE task_id = $1`,
      [newTask.id],
    );
    // Lägg ID:na till en array
    const familyMemberIds = familyMembersResult.rows.map(
      (row) => row.family_member_id,
    );

    // Skicka tillbaka task som svar inklusive kopplade family_member_ids
    response.status(201).json({
      ...newTask,
      family_member_ids: familyMemberIds,
    });
  } catch (error) {
    console.error('Fel vid skapande av uppgift:', error);
    response.status(500).json({ error: 'Kunde inte spara uppgiften' });
  }
});

// PUT tasks
app.put('/api/tasks/:id', authenticate, async (request, response) => {
  const taskId = request.params.id;
  const userId = (request as UserRequest).user?.id;
  const {
    title,
    description,
    due_date,
    completed,
    //family_member_ids,
    event_id,
  } = request.body;

  try {
    const checkResult = await client.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [taskId, userId],
    );

    if (checkResult.rows.length === 0) {
      response.status(404).json({ error: 'Uppgift hittades inte' });
      return;
    }

    // Uppdatera uppgiften
    await client.query(
      `UPDATE tasks SET
       title = $1,
       description = $2,
       due_date = $3,
       completed = $4,
       event_id = $5
       WHERE id = $6`,
      [
        title,
        description,
        due_date || null,
        completed === undefined ? false : completed,
        event_id || null,
        taskId,
      ],
    );

    response.status(200).json({ message: 'Uppgift uppdaterad' });
  } catch (error) {
    console.error('Fel vid uppdatering av uppgift:', error);
    response.status(500).json({ error: 'Kunde inte uppdatera uppgift' });
  }
});

//DELETE tasks
app.delete('/api/tasks/:id', authenticate, async (request, response) => {
  const taskId = request.params.id;
  const userId = (request as UserRequest).user?.id;

  try {
    // Kontrollera att användaren är kopplad till uppgiften via någon familjemedlem
    const check = await client.query(
      `SELECT tasks.id
       FROM tasks
       JOIN task_family_members ON tasks.id = task_family_members.task_id
       JOIN family_members ON task_family_members.family_member_id = family_members.id
       WHERE tasks.id = $1 AND family_members.user_id = $2`,
      [taskId, userId],
    );

    if (check.rows.length === 0) {
      response.status(404).json({
        error: 'Uppgift hittades inte eller tillhör inte dig',
      });
      return;
    }

    // Ta bort uppgiften (kommer även ta bort rader i task_family_members pga ON DELETE CASCADE)
    await client.query('DELETE FROM tasks WHERE id = $1', [taskId]);

    response.status(200).json({ message: 'Uppgift borttagen' });
  } catch (error) {
    console.error('Fel vid borttagning av uppgift:', error);
    response.status(500).json({ error: 'Kunde inte ta bort uppgift' });
  }
});

// GET events
app.get('/api/events', authenticate, async (request, response) => {
  const userId = (request as UserRequest).user?.id;

  //Hämta bara familjemedlemmar som hör till inlogagd användare
  try {
    const eventsResult = await client.query(
      `SELECT DISTINCT events.*
      FROM events
      JOIN event_family_members efm ON events.id = efm.event_id
      JOIN family_members fm ON efm.family_member_id = fm.id
      WHERE fm.user_id = $1
      ORDER BY events.event_date ASC`,
      [userId],
    );
    const events = eventsResult.rows;

    // Hämta familjemedlemmar kopplade till varje event
    for (const event of events) {
      const familyResult = await client.query(
        `SELECT family_members.id, family_members.name, family_members.role, family_members.profile_image
         FROM event_family_members
         JOIN family_members ON event_family_members.family_member_id = family_members.id
         WHERE event_family_members.event_id = $1`,
        [event.id],
      );

      event.family_member_ids = familyResult.rows.map((row) => row.id);
      event.family_members = familyResult.rows;
    }

    response.json(events);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Kunde inte hämta events' });
  }
});

// POST events
app.post('/api/events', authenticate, async (request, response) => {
  const {
    title,
    event_date,
    start_time,
    end_time,
    description,
    user_id,
    family_member_ids,
  } = request.body;

  // Kontroll att minst en familjemedlem är kopplad
  if (
    !family_member_ids ||
    !Array.isArray(family_member_ids) ||
    family_member_ids.length === 0
  ) {
    response.status(400).json({
      error: 'Minst en familjemedlem måste kopplas till eventet',
    });
    return;
  }

  // Skapa event
  try {
    const insertEventResult = await client.query(
      'INSERT INTO events (title, event_date, end_time, start_time, description, user_id) VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING *',
      [title, event_date, end_time, start_time, description, user_id],
    );
    const newEvent = insertEventResult.rows[0];

    // Lägg till kopplingar i event_family_members
    for (const familyMemberId of family_member_ids) {
      await client.query(
        'INSERT INTO event_family_members (event_id, family_member_id) VALUES ($1, $2)',
        [newEvent.id, familyMemberId],
      );
    }

    // Hämta event inklusive kopplade family_member_ids
    const familyMembersResult = await client.query(
      `SELECT family_members.id, family_members.name, family_members.role, family_members.profile_image
      FROM family_members
      JOIN event_family_members ON family_members.id = event_family_members.family_member_id
      WHERE event_family_members.event_id = $1`,
      [newEvent.id],
    );

    //const familyMemberIds = eventFamilyResult.rows.map(row => row.family_member_id);
    const familyMembers = familyMembersResult.rows;
    //console.log('Hämtade familjemedlemmar:', familyMembers);

    // Skapa array med bara ids
    const familyMemberIds = familyMembers.map((fm) => fm.id);

    response.status(201).json({
      ...newEvent,
      family_member_ids: familyMemberIds, //felsök
      family_members: familyMembers,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Kunde inte skapa event' });
  }
});

// DELETE Ta bort ett event
app.delete('/api/events/:id', authenticate, async function (request, response) {
  // Hämta event-id från URL:en
  const eventId = request.params.id;

  try {
    // Kontrollera om eventet finns innan vi försöker ta bort det
    const checkResult = await client.query(
      'SELECT * FROM events WHERE id = $1',
      [eventId],
    );

    if (checkResult.rows.length === 0) {
      response.status(404).json({ error: 'Event hittades inte' });
      return;
    }

    // Ta bort eventet från databasen
    await client.query('DELETE FROM events WHERE id = $1', [eventId]);

    // Skicka ett enkelt meddelande tillbaka
    response.status(200).json({ message: 'Eventet togs bort' });
  } catch (error) {
    console.error('Fel vid borttagning av event:', error);
    response.status(500).json({ error: 'Kunde inte ta bort event' });
  }
});

//GET Veckoschema
app.get('/api/week-tasks', authenticate, async (request, response) => {
  try {
    const userId = (request as UserRequest).user?.id;

    // Hämta återkommande uppgifter med veckodag som array
    const recurringTasksResult = await client.query(
      `WITH task_weekdays_agg AS (
      SELECT
      t.id,
      t.title,
      t.description,
      t.due_date,
      t.completed,
      t.event_id,
      t.user_id,
      t.category_id,
      COALESCE(array_agg(DISTINCT tw.weekday) FILTER (WHERE tw.weekday IS NOT NULL), '{}') AS recurring_weekdays
    FROM tasks t
    LEFT JOIN task_weekdays tw ON tw.task_id = t.id
    WHERE t.user_id = $1
    GROUP BY t.id, t.title, t.description, t.due_date, t.completed, t.event_id, t.user_id, t.category_id
  ),
  family_members_agg AS (
    SELECT
      tfm.task_id,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', fm.id,
            'name', fm.name
          )
        ) FILTER (WHERE fm.id IS NOT NULL),
        '[]'
      ) AS family_members
    FROM task_family_members tfm
    LEFT JOIN family_members fm ON fm.id = tfm.family_member_id
    GROUP BY tfm.task_id
  )
  SELECT
    twa.id,
    twa.title,
    twa.description,
    twa.due_date,
    twa.completed,
    twa.event_id,
    twa.user_id,
    twa.category_id,
    twa.recurring_weekdays,
    c.name AS category_name,
    c.color AS category_color,
    c.icon AS category_icon,
    COALESCE(fma.family_members, '[]') AS family_members
  FROM task_weekdays_agg twa
  LEFT JOIN categories c ON c.id = twa.category_id
  LEFT JOIN family_members_agg fma ON fma.task_id = twa.id
  ORDER BY twa.title`,
      [userId],
    );

    const recurringTasks = recurringTasksResult.rows;
    //console.log('recurringTasksResult.rows:', recurringTasksResult.rows)

    response.json({ recurringTasks });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Kunde inte hämta veckans tasks' });
  }
});

//POST Veckoschema
app.post('/api/week-tasks', authenticate, async (request, response) => {
  console.log('Request body:', request.body);
  try {
    const {
      title,
      description,
      recurring_weekdays,
      family_member_ids,
      category_id,
    } = request.body;
    const userId = (request as UserRequest).user?.id;

    // Kontrollera att family_member_ids tillhör användaren
    if (family_member_ids && family_member_ids.length > 0) {
      const checkFamilyMembers = await client.query(
        `SELECT id FROM family_members WHERE id = ANY($1) AND user_id = $2`,
        [family_member_ids, userId],
      );

      if (checkFamilyMembers.rows.length !== family_member_ids.length) {
        response.status(403).json({
          error: 'Familjemedlem tillhör inte din användare',
        });
        return;
      }
    }

    // Lägg till raden i tasks
    const insertTaskResult = await client.query(
      `INSERT INTO tasks (title, description, user_id, category_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, userId, category_id],
    );
    const newTask = insertTaskResult.rows[0];

    // Lägg till kopplingar i task_family_members
    if (family_member_ids && family_member_ids.length > 0) {
      for (const familyMemberId of family_member_ids) {
        await client.query(
          `INSERT INTO task_family_members (task_id, family_member_id) VALUES ($1, $2)`,
          [newTask.id, familyMemberId],
        );
      }
    }

    // Lägg till kopplingar i task_weekdays (för recurring)
    if (Array.isArray(recurring_weekdays) && recurring_weekdays.length > 0) {
      const filteredWeekdays = recurring_weekdays.filter(
        (day) => day !== null && day !== undefined,
      );
      for (const weekday of filteredWeekdays) {
        await client.query(
          `INSERT INTO task_weekdays (task_id, weekday) VALUES ($1, $2)`,
          [newTask.id, weekday],
        );
      }
    }

    // Hämta tillbaka sparade family_member_ids ur task_family_members
    const familyMembersResult = await client.query(
      `SELECT family_member_id FROM task_family_members WHERE task_id = $1`,
      [newTask.id],
    );

    const family_member_ids_from_db = familyMembersResult.rows.map(
      (row) => row.family_member_id,
    );

    // Hämta tillbaka sparade recurring_weekdays ur task_weekdays
    const recurringWeekdaysResult = await client.query(
      `SELECT weekday FROM task_weekdays WHERE task_id = $1`,
      [newTask.id],
    );
    const recurring_weekdays_from_db = recurringWeekdaysResult.rows.map(
      (row) => row.weekday,
    );

    // Hämta kategoriinfo
    const categoryInfoResult = await client.query(
      `SELECT
        c.name  AS category_name,
        c.color AS category_color,
        c.icon  AS category_icon
      FROM categories c
      WHERE c.id = $1`,
      [newTask.category_id],
    );

    const categoryRow = categoryInfoResult.rows[0] || {
      category_name: null,
      category_color: null,
      category_icon: null,
    };

    // Hämta family_members-array
    let fullFamilyMembers: {
      id: number;
      name: string;
      role: string;
      profile_image: string;
    }[] = [];
    if (family_member_ids_from_db.length > 0) {
      const fullMembersResult = await client.query(
        `SELECT
          fm.id,
          fm.name,
          fm.role,
          fm.profile_image
        FROM task_family_members tfm
        JOIN family_members fm ON fm.id = tfm.family_member_id
        WHERE tfm.task_id = $1`,
        [newTask.id],
      );

      fullFamilyMembers = fullMembersResult.rows;
    }

    // Bygg och skicka tillbaka uppgiften med alla fält
    const completeTask = {
      ...newTask,
      family_member_ids: family_member_ids_from_db,
      recurring_weekdays: recurring_weekdays_from_db,
      category_name: categoryRow.category_name,
      category_color: categoryRow.category_color,
      category_icon: categoryRow.category_icon,
      family_members: fullFamilyMembers,
    };

    //console.log('recurring_weekdays:', recurring_weekdays);
    //console.log('family_member_ids:', family_member_ids);
    //console.log('completeTask', completeTask);

    response.status(201).json(completeTask);
  } catch (error) {
    console.error('Fel vid skapande av veckouppgift:', error);
    response.status(500).json({ error: 'Kunde inte skapa veckouppgift' });
  }
});

// PUT veckoschema
app.put('/api/week-tasks/:id', authenticate, async (request, response) => {
  // Hämta id för uppgiften från URL-parametern
  const taskId = request.params.id;
  // Hämta inloggad användares id från request (från autentisering)
  const userId = (request as UserRequest).user?.id;
  // Hämta data som ska uppdateras från request body
  const {
    title,
    description,
    completed,
    family_member_ids,
    recurring_weekdays,
    category_id,
  } = request.body;

  try {
    // Kontrollera att uppgiften finns
    const checkResult = await client.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [taskId, userId],
    );

    if (checkResult.rows.length === 0) {
      response.status(404).json({ error: 'Uppgift hittades inte' });
      return;
    }

    // Uppdatera uppgiften
    await client.query(
      `UPDATE tasks SET
        title = $1,
        description = $2,
        completed = $3,
        category_id = $4
      WHERE id = $5`,
      [
        title,
        description,
        completed === undefined ? false : completed,
        category_id,
        taskId,
      ],
    );

    // Uppdatera kopplingar i task_weekdays
    if (Array.isArray(recurring_weekdays)) {
      // Ta bort gamla kopplingar
      await client.query(`DELETE FROM task_weekdays WHERE task_id = $1`, [
        taskId,
      ]);
      // Lägg till nya veckodagar
      for (const weekday of recurring_weekdays) {
        await client.query(
          `INSERT INTO task_weekdays (task_id, weekday) VALUES ($1, $2)`,
          [taskId, weekday],
        );
      }
    }

    // Uppdatera kopplingar i task_family_members
    if (Array.isArray(family_member_ids)) {
      // Radera gamla kopplingar först
      await client.query(`DELETE FROM task_family_members WHERE task_id = $1`, [
        taskId,
      ]);
      // Lägg till nya kopplingar
      for (const familyMemberId of family_member_ids) {
        await client.query(
          `INSERT INTO task_family_members (task_id, family_member_id) VALUES ($1, $2)`,
          [taskId, familyMemberId],
        );
      }
    }

    response.status(200).json({ message: 'Uppgift uppdaterad' });
  } catch (error) {
    console.error('Fel vid uppdatering av uppgift:', error);
    response.status(500).json({ error: 'Kunde inte uppdatera uppgift' });
  }
});

// DELETE week-task
app.delete('/api/week-tasks/:id', authenticate, async (request, response) => {
  try {
    const taskId = request.params.id;
    const userId = (request as UserRequest).user?.id;

    // Kontrollera att uppgiften tillhör användaren
    const checkTaskResult = await client.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [taskId, userId],
    );

    if (checkTaskResult.rows.length === 0) {
      response.status(404).json({
        error: 'Uppgift hittades inte eller tillhör inte dig',
      });
      return;
    }

    // Ta bort uppgiften (kopplingstabeller rensas automatiskt via ON DELETE CASCADE)
    await client.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);

    response.json({ message: 'Uppgift raderad' });
  } catch (error) {
    console.error('Fel vid radering av uppgift:', error);
    response.status(500).json({ error: 'Kunde inte radera uppgiften' });
  }
});

// Fix för att dropdownmenyn visar äö fel.
function fixName(n: string): string {
  return n.replace('„', 'ä').replace('™', 'ö');
}

// GET kategorier
app.get('/api/categories', async (_request, response) => {
  try {
    const result = await client.query(
      `SELECT id, name, color, icon FROM categories ORDER BY name`,
    );
    //console.log('Kategorier från get categories:', result.rows);

    const fixedCategories = result.rows.map((row) => ({
      ...row,
      name: fixName(row.name),
    }));

    response.json(fixedCategories);
  } catch (error) {
    console.error('Fel vid hämtning av kategorier:', error);
    response.status(500).json({ error: 'Kunde inte hämta kategorier' });
  }
});

// Servera frontend från dist-mappen
app.use(express.static(path.join(path.resolve(), 'dist')));

// Fallback-route för SPA-routing, skicka alltid index.html
app.get('*', (_request, response) => {
  response.sendFile(path.join(path.resolve(), 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
