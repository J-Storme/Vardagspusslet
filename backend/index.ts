import express, { Request, Response, NextFunction } from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

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
app.use(cors(/*{
  origin: 'http://localhost:5173',
  credentials: true
}*/));
app.use(express.json()); // middleware för att tolka JSON-body

// Anslut till PostgreSQL-databas
const client = new Client({
  connectionString: process.env.PGURI,
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect();

// Middleware för att autentisera token
async function authenticate(request: UserRequest, response: Response, next: NextFunction) {
  // Hämta token från query-parametern eller authorization-headren
  let token = request.query.token as string || request.headers.authorization;

  if (token && token?.startsWith('Bearer ')) {
    token = token.slice(7); // Tar bort "Bearer "
  }

  console.log('Token i middleware-kontrollen:', token);

  if (!token) {
    return response.status(401).json({ error: 'Token saknas' });
  }

  try {
    // Hämta användaren baserat på token
    const result = await client.query('SELECT * FROM users WHERE token = $1', [token]);
    const user = result.rows[0];

    if (!user) {
      return response.status(401).json({ error: 'Ogiltig token' });
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


// GET
app.get('/', (_request, response) => {
  response.send('root');
});


// GET api
app.get('/api', (_request, response) => {
  response.send({ test: 'test' })
})

// POST & INSERT, registera användare FUNKAR!
app.post('/api/register', async (request, response) => {
  const { email, password, name } = request.body;
  const token = uuidv4();

  try {
    // Kontrollera om användaren redan finns i databasen
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return response.status(400).json({ error: 'E-postadress är redan registrerad' });
    }

    // Sätt in den nya användaren i databasen
    await client.query(
      'INSERT INTO users (token, email, password, name) VALUES ($1, $2, $3, $4)',
      [token, email, password, name]
    );

    // Hämta den nya användaren
    const selectResult = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const newUser = selectResult.rows[0];

    return response.status(201).json({
      message: 'Registrering lyckades',
      token: newUser.token,
      name: newUser.name,
      email: newUser.email,
      id: newUser.id
    });

  } catch (error) {
    console.error('Fel vid registrering:', error);
    return response.status(500).json({ error: 'Kunde inte registrera användare' });
  }
});


// POST login
app.post('/api/login', async (request, response) => {
  const { email, password } = request.body;

  // hämta en user från databas där email är samma som skrivs in
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || password !== user.password) {
      return response.status(401).json({ error: 'Fel e-post eller lösenord' });
    }

    // Skapa en token
    const token = uuidv4();

    // Uppdatera token i databasen
    await client.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.id]);
    response.json({
      message: 'Inloggad', token, email: user.email, name: user.name, id: user.id
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
      'SELECT id, name, email, adress FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'Användare hittades inte' });
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

  console.log('Hämtar familjemedlemmar för användare:', userId);

  try {
    const result = await client.query(
      'SELECT * FROM family_members WHERE user_id = $1',
      [userId]
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
      [userId, name, role, profile_image || null]
    );
    response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Kunde inte spara familjemedlem.' });
  }
});


// POST med UPDATE Logout 
app.post('/logout', authenticate, async (request, response) => {
  const token = request.query.token as string;

  try {
    // Loggar ut genom att sätta token till null
    await client.query('UPDATE users SET token = NULL WHERE token = $1', [token]);
    response.status(200).json({ message: 'Utloggad' });
  } catch (error) {
    console.error('Fel vid utloggning:', error);
    response.status(500).json({ error: 'Kunde inte logga ut' });
  }
});


// GET tasks
app.get('/api/tasks', async (_request, response) => {
  try {
    const result = await client.query('SELECT * FROM tasks');

    if (result.rows.length === 0) {
      return response.status(404).send('Inga uppgifter hittades');
    }

    response.status(200).json(result.rows);
  } catch (error) {
    console.error('Fel i backend:', error);
    response.status(500).send('Serverfel vid hämtning av uppgifter');
  }
});

// GET events
app.get('/api/events', async (_request, response) => {
  try {
    const result = await client.query('SELECT * FROM events');
    response.json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Kunde inte hämta events' });
  }
});

/*
GET / events              // Hämta alla
POST / events             // Lägg till nytt event
DELETE / events /: id       // Ta bort ett event
*/



// Servera frontend från dist-mappen
app.use(express.static(path.join(path.resolve(), 'dist')))

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});