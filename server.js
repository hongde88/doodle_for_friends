const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5001;
const EventHandler = require('./event_handler');
global.defaultWordList = Object.keys(require('./words.json'));

// Init middleware
app.use(express.json({ extended: false }));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
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
