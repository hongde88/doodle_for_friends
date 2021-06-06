const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, { pingTimeout: 30000 });
const PORT = process.env.PORT || 5001;
const EventHandler = require('./event_handler');
global.defaultWordList = Object.keys(require('./words.json'));
const YOUTUBE_API_URL =
  process.env.YOUTUBE_API_URL || 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_SEARCH_PART = process.env.YOUTUBE_SEARCH_PART || 'snippet';
const YOUTUBE_SEARCH_MAX_RESULT = process.env.YOUTUBE_SEARCH_MAX_RESULT
  ? Number(process.env.YOUTUBE_SEARCH_MAX_RESULT)
  : 20;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const axios = require('axios').default;

// Init middleware
app.use(express.json({ extended: false }));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  // app.use(express.static('client/build'));
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Allow CORS
  app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

  app.post('/search', async (req, res) => {
    const search = req.body.search;

    if (typeof search !== 'string') {
      return res.status(400).send('Bad request body');
    }

    const fullPath = `${YOUTUBE_API_URL}/search?part=${YOUTUBE_SEARCH_PART}&maxResults=${YOUTUBE_SEARCH_MAX_RESULT}&q=${encodeURIComponent(
      search
    )}&type=video&key=${YOUTUBE_API_KEY}`;

    try {
      const result = await axios.get(fullPath);
      if (result && result.data && result.data.items) {
        return res.send(result.data.items);
      } else {
        return res.send([]);
      }
    } catch (error) {
      return res.status(500).send('Failed to fetch songs from Youtube');
    }
  });
} else {
  // this is for local testing only and will be removed before commit
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/', (req, res) => res.sendFile('index.html'));
}

io.on('connection', (socket) => {
  console.log(`a client ${socket.id} has been connected to the server`);

  const eventHandler = new EventHandler(io, socket);
  eventHandler.handleGameEvents();
});

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
