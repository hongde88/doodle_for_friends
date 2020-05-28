const nameGenerator = require('fakerator')();

const messageCache = { room: [] };

class EventHandler {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  handleGameEvents() {
    const socket = this.socket;
    const io = this.io;

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

  handlePrivateRoomEvent(socket) {
    return (data) => {};
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
