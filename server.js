const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5001;

// Init middleware
app.use(express.json({ extended: false }));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

io.on('connection', (socket) => {
  console.log('a client has been connected to the server');

  // drawing handler
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));

  // chat handler
  socket.on('new message', (data) => {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
    });
  });
});

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
