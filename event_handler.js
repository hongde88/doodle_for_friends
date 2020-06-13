const nameGenerator = require('fakerator')();

const randomstring = require('randomstring');

const messageCache = {};

const rooms = {};

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

    // create private room handler
    socket.on('create private room', this.handleCreatePrivateRoomEvent(socket));

    // update private room settings
    socket.on('update room settings', this.handleUpdateRoomSettings(socket));

    // start private game handler
    socket.on('start private game', this.handleStartPrivateGameEvent(socket));

    // join private room handler
    socket.on('join private room', this.handleJoinPrivateRoomEvent(io, socket));

    // start timer handler
    socket.on('timer', this.handleStartTimerEvent(io, socket));

    // select word handler
    socket.on('select word', this.handleSelectWordEvent(socket));

    // disconnect handler
    socket.on(
      'disconnect',
      this.handleDisconnectOrLeaveEvent(socket, 'disconnect')
    );

    // leave handler
    socket.on('leave', this.handleDisconnectOrLeaveEvent(socket, 'leave'));
  }

  handleDrawingEvent(socket) {
    return (data) => socket.broadcast.emit('drawing', data);
  }

  handleNewMessageEvent(io, socket) {
    return (data) => {
      const username = data.username || socket.username;
      const roomId = data.roomId || socket.roomId;
      if (!rooms[roomId]) return;
      const message = `${username}: ${data.message}`;
      messageCache[roomId] = messageCache[roomId] || [];
      messageCache[roomId].push(message);
      io.to(roomId).emit('new message', message);
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

  handleCreatePrivateRoomEvent(socket) {
    return (data, callback) => {
      const roomId = randomstring.generate(9);
      socket.roomId = roomId;
      socket.join(roomId);
      data.username = data.username || nameGenerator.names.firstName();
      socket.username = data.username;
      const avatarIndex = data.avatarIndex || 0;
      rooms[roomId] = {
        host: data.username,
        maxRound: 3,
        drawTime: 80,
        exclusive: false,
        currentRound: 0,
        users: {},
        gameStarted: false,
        numUsers: 1,
      };

      rooms[roomId].users[data.username] = { avatarIndex, id: socket.id };

      messageCache[roomId] = [];

      const users = this.generateUserList(roomId);

      const numUsers = rooms[roomId].numUsers;

      const defaultRoomSettings = {
        roomId,
        maxRound: 3,
        drawTime: 80,
        exclusive: false,
        users,
        numUsers,
        host: data.username,
        gameStarted: false,
        playable: false,
      };

      if (callback) {
        callback(defaultRoomSettings);
      }
    };
  }

  handleUpdateRoomSettings(socket) {
    return (data, callback) => {
      const roomId = data.roomId || socket.roomId;

      if (!rooms[roomId]) return;

      rooms[roomId].maxRound = data.maxRound;
      rooms[roomId].drawTime = data.drawTime;
      rooms[roomId].exclusive = data.exclusive;

      if (data.words) {
        const words = data.words.split(',').map((word) => word.trim());
        if (data.exclusive) {
          rooms[roomId].words = words;
        } else {
          rooms[roomId].words = [...words, ...defaultWordList];
        }
      } else {
        rooms[roomId].words = defaultWordList;
      }

      rooms[roomId].searchRange = rooms[roomId].words.length - 1;

      const newSettings = {
        maxRound: data.maxRound,
        drawTime: data.drawTime,
        exclusive: data.exclusive,
      };

      socket.to(roomId).emit('room settings updated', newSettings);

      if (callback) {
        callback(newSettings);
      }
    };
  }

  handleStartPrivateGameEvent(socket) {
    return () => {
      const roomId = socket.roomId;
      if (rooms[roomId]) {
        rooms[roomId].currentRound = 1;
        rooms[roomId].currentPlayer;
        socket.to(roomId).emit('private game started');
      }
    };
  }

  handleJoinPrivateRoomEvent(io, socket) {
    return (data, callback) => {
      const roomId = data.roomId;
      const avatarIndex = data.avatarIndex;

      if (!roomId || !rooms[roomId]) {
        if (callback) {
          return callback({
            type: 'room error',
            message: 'room does not exist',
          });
        } else {
          return socket.emit('room does not exist');
        }
      }

      let username = data.username;
      if (!username) {
        username = nameGenerator.names.firstName();
      } else {
        if (rooms[roomId].users.hasOwnProperty(username)) {
          if (callback) {
            return callback({
              type: 'user error',
              message: 'name already exists',
            });
          } else {
            return socket.emit('name exists');
          }
        }
      }

      socket.roomId = roomId;
      socket.username = username;
      socket.join(roomId);
      rooms[roomId].users[username] = { avatarIndex, id: socket.id };
      rooms[roomId].numUsers++;
      io.to(roomId).emit('private room joined', {
        users: this.generateUserList(roomId),
        maxRound: rooms[roomId].maxRound,
        drawTime: rooms[roomId].drawTime,
        exclusive: rooms[roomId].exclusive,
        roomId,
        playable: rooms[roomId].numUsers > 1,
        host: rooms[roomId].host,
        gameStarted: rooms[roomId].gameStarted,
        numUsers: rooms[roomId].numUsers,
      });

      if (callback) {
        callback({
          username,
          isHost: username === rooms[roomId].host,
        });
      }

      if (messageCache[socket.roomId])
        socket.emit('old messages', messageCache[socket.roomId]);
    };
  }

  handleStartTimerEvent(io, socket) {
    return (data) => {
      const roomId = data.roomId || socket.roomId;
      let remainingTime = data.duration + 1;
      console.log(remainingTime);
      const interval = setInterval(() => {
        remainingTime--;
        io.to(roomId).emit('timer', { remainingTime });
        if (remainingTime === 0) clearInterval(interval);
      }, 1000);
    };
  }

  handleSelectWordEvent(socket) {
    return (data) => {
      const roomId = data.roomId || socket.roomId;
      rooms[roomId].selectedWord = data.selectedWord;
    };
  }

  handleDisconnectOrLeaveEvent(socket, type) {
    return () => {
      if (type === 'disconnect') {
        console.log(
          `a client ${socket.id} has been disconnected from the server`
        );
      } else {
        console.log(`a client ${socket.id} has left the room ${socket.roomId}`);
      }
      const roomId = socket.roomId;
      const username = socket.username;
      if (roomId) {
        if (rooms[roomId] && rooms[roomId].users) {
          delete rooms[roomId].users[username];
          rooms[roomId].numUsers--;
          if (rooms[roomId].numUsers === 0) {
            delete rooms[roomId];
            delete messageCache[roomId];
            return;
          } else {
            if (username === rooms[roomId].host) {
              rooms[roomId].host = Object.keys(rooms[roomId].users)[0];
            }
          }
        }

        if (rooms[roomId]) {
          socket.to(roomId).emit('user left', {
            host: rooms[roomId].host,
            playable: rooms[roomId].numUsers > 1,
            users: this.generateUserList(roomId),
          });
          const message = `${username} just left.`;
          if (messageCache[roomId]) {
            messageCache[roomId].push(message);
          }
          socket.to(roomId).emit('new message', message);
        }

        socket.leave(roomId);
        socket.roomId = null;
      }
    };
  }

  pickRandomWords(roomId, searchRange, wordCount) {
    const randomWords = [];
    const randomIndexes = [];

    for (let i = 0; i < wordCount; i++) {
      const randomIndex = this.generateRandomNumber(0, searchRange);
      randomIndexes.push(randomIndex);
      randomWords.push(rooms[roomId].words[randomIndex]);
    }

    const wordList = rooms[roomId].words;
    for (let i = 0; i < wordCount; i++) {
      [wordList[randomIndexes[i]], wordList[searchRange - i]] = [
        wordList[searchRange - i],
        wordList[randomIndexes[i]],
      ];
    }

    return randomWords;
  }

  generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateUserList(roomId) {
    const users = Object.keys(rooms[roomId].users).map((user) => {
      return {
        name: user,
        index: rooms[roomId].users[user].avatarIndex,
      };
    });

    return users;
  }
}

module.exports = EventHandler;
