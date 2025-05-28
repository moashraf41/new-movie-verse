const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001; // Use port 3001 or environment variable

// Middleware to parse JSON bodies
app.use(express.json());

// Read the data from db.json
const dbPath = path.join(__dirname, 'db.json');
let data = {};

// Function to read data from db.json
const readData = () => {
  try {
    const dbRaw = fs.readFileSync(dbPath);
    data = JSON.parse(dbRaw);
  } catch (error) {
    console.error('Error reading db.json:', error);
    // Initialize with empty data if read fails
    data = { 
      movies: [], 
      watchlist: [], 
      people: [], 
      series: [] 
    };
  }
};

// Function to write data to db.json
const writeData = () => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
};

// Initial data read
readData();

// Allow CORS - essential for frontend to access this backend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Movies endpoints
app.get('/movies', (req, res) => {
  readData();
  res.json(data.movies);
});

app.get('/movies/:id', (req, res) => {
  readData();
  const movie = data.movies.find(m => m.id === req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

// Series endpoints
app.get('/series', (req, res) => {
  readData();
  res.json(data.series);
});

app.get('/series/:id', (req, res) => {
  readData();
  const series = data.series.find(s => s.id === req.params.id);
  if (series) {
    res.json(series);
  } else {
    res.status(404).json({ message: 'Series not found' });
  }
});

// People endpoints
app.get('/people', (req, res) => {
  readData();
  res.json(data.people);
});

app.get('/people/:id', (req, res) => {
  readData();
  const person = data.people.find(p => p.id === req.params.id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ message: 'Person not found' });
  }
});

// Watchlist endpoints
app.get('/watchlist', (req, res) => {
  readData();
  res.json(data.watchlist || []);
});

app.post('/watchlist', (req, res) => {
  readData();
  const newItem = req.body;
  if (!newItem.id) {
    newItem.id = Date.now().toString();
  }
  if (!data.watchlist.find(item => item.id === newItem.id)) {
    data.watchlist.push(newItem);
    writeData();
    res.status(201).json(newItem);
  } else {
    res.status(409).json({ message: 'Item already in watchlist' });
  }
});

app.delete('/watchlist/:mediaId', (req, res) => {
  readData();
  const mediaId = req.params.mediaId;
  const initialLength = data.watchlist.length;
  data.watchlist = data.watchlist.filter(item => item.id != mediaId);
  if (data.watchlist.length < initialLength) {
    writeData();
    res.status(200).json({ message: 'Item removed from watchlist' });
  } else {
    res.status(404).json({ message: 'Item not found in watchlist' });
  }
});

// Search endpoints
app.get('/search/movies', (req, res) => {
  readData();
  const query = req.query.title?.toLowerCase();
  if (query) {
    const results = data.movies.filter(movie => 
      movie.title.toLowerCase().includes(query)
    );
    res.json(results);
  } else {
    res.json([]);
  }
});

app.get('/search/series', (req, res) => {
  readData();
  const query = req.query.title?.toLowerCase();
  if (query) {
    const results = data.series.filter(series => 
      series.title.toLowerCase().includes(query)
    );
    res.json(results);
  } else {
    res.json([]);
  }
});

app.get('/search/people', (req, res) => {
  readData();
  const query = req.query.name?.toLowerCase();
  if (query) {
    const results = data.people.filter(person => 
      person.name.toLowerCase().includes(query)
    );
    res.json(results);
  } else {
    res.json([]);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 