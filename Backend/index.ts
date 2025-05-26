import express, { Request, Response, NextFunction } from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Läs in miljövariabler från .env-fil
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors()); // middleware som löser cors
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
async function authenticate(request: Request, response: Response, next: NextFunction) {
  // Hämta token från query-parametern eller authorization-headren
  const token = request.query.token as string || request.headers.authorization;

  if (!token) {
    return response.status(401).json({ error: 'Token saknas' });
  }
  try {
    // Hämta användaren baserat på token
    const user = await client.query('SELECT * FROM users WHERE token = $1', [token]);


    if (user.rows.length === 0) {
      return response.status(401).json({ error: 'Ogiltig token' });
    }

    // Spara användarens ID i request-objektet
    (request as any).user = user.rows[0].id;
    next(); // Släpp vidare till nästa middleware eller route
  } catch (error) {
    console.error('Fel vid autentisering:', error);
    response.status(500).json({ error: 'Serverfel vid autentisering' });
  }
}

// Token-hantering
const tokens: { [email: string]: string } = {};

// GET
app.get('/', (_request, response) => {
  response.send('root');
});

// GET api
app.get("/api", (_request, response) => {
  response.send({ test: "test" })
})



/*
GET / events              // Hämta alla
POST / events             // Lägg till nytt event
DELETE / events /: id       // Ta bort ett event
*/

/*
// POST & INSERT, registera användare
app.post('/register', async (request, response) => {
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

    response.status(201).json({ message: 'Registrering lyckades', token });
  } catch (error) {
    console.error('Fel vid registrering:', error);
    response.status(500).json({ error: 'Kunde inte registrera användare' });
  }
});

// POST login
app.post('/login', async (request, response) => {
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

    response.json({ message: 'Inloggad', token, email });
  } catch (error) {
    console.error('Fel vid inloggning:', error);
    response.status(500).json({ error: 'Något gick fel vid inloggning' });
  }
});

// GET user
app.get('/user', authenticate, async (request, response) => {
  const userId = (request as any).user;

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
app.get('/tasks', async (_request, response) => {
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
app.get('/events', async (_request, response) => {
  try {
    const result = await client.query('SELECT * FROM events');
    response.json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Kunde inte hämta events' });
  }
});

*/

// Servera frontend från dist-mappen
app.use(express.static(path.join(path.resolve(), 'dist')))

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});