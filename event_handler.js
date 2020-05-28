const nameGenerator = require('fakerator')();

const messageCache = { room: [] };

const rooms = {};

const splitRegEx = /[^ ,]/g;

class EventHandler {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  handleGameEvents() {
    const socket = this.socket;
    const io = this.io;

    console.log(defaultWordList.length);

    // drawing handler
    socket.on('drawing', this.handleDrawingEvent(socket));

    // chat handler
    socket.on('new message', this.handleNewMessageEvent(io, socket));

    // play handler
    socket.on('play', this.handlePlayEvent(socket));

    // private room handler
    socket.on('private', this.handlePrivateRoomEvent(io, socket));

    // start timer handler
    socket.on('timer', this.handleStartTimerEvent(io));

    // leave handler
    socket.on('disconnect', this.handleLeaveEvent(socket));
  }

  handleDrawingEvent(socket) {
    return (data) => socket.broadcast.emit('drawing', data);
  }

  handleNewMessageEvent(io, socket) {
    return (data) => {
      const bundle = {
        username: socket.username,
        message: data,
      };
      messageCache.room.push(bundle);
      io.sockets.emit('new message', bundle);
    };
  }

  handlePlayEvent(socket) {
    return (data) => {
      if (!data.username) data.username = nameGenerator.names.firstName();
      socket.emit('old messages', messageCache);
      socket.username = data.username;
      socket.broadcast.emit('join', {
        username: data.username,
      });
    };
  }

  handlePrivateRoomEvent(io, socket) {
    return (data) => {
      socket.username = data.username;
      rooms[socket.id] = {
        host: data.username,
        rounds: data.rounds,
        timer: data.timer,
        exclusive: data.exclusive,
      };

      if (data.words) {
        const words = data.words.match(splitRegEx);
        if (data.exclusive) {
          rooms[socket.id].words = words;
        } else {
          rooms[socket.id].words = [...words, ...defaultWordList];
        }
      } else {
        rooms[socket.id].words = defaultWordList;
      }

      rooms[socket.id].searchRange = rooms[socket.id].words.length - 1;

      io.to(socket.id).emit('private', {
        roomId: socket.id,
        numberOfWords: rooms[socket.id].searchRange + 1,
      });

      console.log(rooms);
    };
  }

  handleStartTimerEvent(io) {
    return (data) => {
      let countdown = data + 1;
      const interval = setInterval(() => {
        countdown--;
        io.sockets.emit('timer', { countdown });
        if (countdown === 0) clearInterval(interval);
      }, 1000);
    };
  }

  handleLeaveEvent(socket) {
    return () => {
      console.log('a client has been disconnected to the server');
      socket.broadcast.emit('leave', {
        username: socket.username,
      });
    };
  }
}

module.exports = EventHandler;
