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
  connectionString: process.env.PORT || 8080
});
client.connect();

// Middleware för att autentisera token
async function authenticate(request: Request, response: Response, next: NextFunction) {
  // Hämta token från query-parametern
  const token = request.query.token as string || request.headers.authorization;

  if (!token) {
    return response.status(401).json({ error: 'Token saknas' });
  }

  // Hämta användaren baserat på token
  const user = await client.query('SELECT * FROM users WHERE token = $1', [token]);

  if (!user) {
    return response.status(401).json({ error: 'Ogiltig token' });
  }

  // Spara användarens ID i request-objektet
  request.user = user.id;
  next(); // Släpp vidare till nästa middleware eller route
}

// Token-hantering
const tokens: { [email: string]: string } = {};



// GET
app.get('/', (require, response) => {
  response.send('API');
});

// GET api
app.get("/api", (_request, response) => {
  response.send({ test: "test" })
})

app.use(express.static(path.join(path.resolve(), "dist")))

/*
GET / events              // Hämta alla
POST / events             // Lägg till nytt event
DELETE / events /: id       // Ta bort ett event
*/
// POST & INSERT, registera användare
app.post('/register', async (request, response) => {
  const { email, password, name, adress } = request.body;
  const token = uuidv4();

  try {
    // Kontrollera om användaren redan finns i databasen
    const existingUser = await database.get('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser) {
      return response.status(400).json({ error: 'E-postadress är redan registrerad' });
    }

    // Sätt in den nya användaren i databasen
    await database.run(
      'INSERT INTO users (token, email, password, name, adress) VALUES (?, ?, ?, ?, ?)',
      [token, email, password, name, adress]
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
    const user = await database.get('SELECT * FROM users WHERE email = ?',
      [email]);

    if (!user || password !== user.password) {
      return response.status(401).json({ error: 'Fel e-post eller lösenord' });
    }
    // Skapa en token
    const token = uuidv4();

    // Uppdatera token i databasen
    await database.run('UPDATE users SET token = ? WHERE id = ?',
      [token, user.id]);

    response.json({ message: 'Inloggad', token, email });
  } catch (error) {
    console.error('Fel vid inloggning:', error);
    response.status(500).json({ error: 'Något gick fel vid inloggning' });
  }
});

// GET user
app.get('/user', authenticate, async (request, response) => {
  const userId = request.user;
  const user = await database.get('SELECT id, name, email, adress FROM users WHERE id = ?',
    [userId]
  );

  if (!user) {
    return response.status(404).json({ error: 'Användare hittades inte' });
  }

  response.json(user);
});

// POST med UPDATE Logout 
app.post('/logout', authenticate, async (request, response) => {
  const token = request.query.token;

  try {
    // Loggar ut genom att sätta token till null
    await database.run('UPDATE users SET token = NULL WHERE token = ?',
      [token]);

    response.status(200).json({ message: 'Utloggad' });
  } catch (error) {
    console.error('Fel vid utloggning:', error);
    response.status(500).json({ error: 'Kunde inte logga ut' });
  }
});

// GET tasks
app.get('/tasks', async (request, response) => {
  try {
    const tasks = await database.all('SELECT * FROM tasks');

    if (!tasks || tasks.length === 0) {
      return response.status(404).send('Inga uppgifter hittades');
    }

    response.status(200).json(tasks);
  } catch (error) {
    console.error('Fel i backend:', error);
    response.status(500).send('Serverfel vid hämtning av uppgifter');
  }
});

// GET events
app.get('/events', async (req, res) => {
  try {
    const events = await database.all('SELECT * FROM events');
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämta events' });
  }
});


// Starta servern
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
