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

    console.log(defaultWordList.length);

    // drawing handler
    socket.on('drawing', this.handleDrawingEvent(socket));

    // chat handler
    socket.on('new message', this.handleNewMessageEvent(io, socket));

    // play handler
    socket.on('play', this.handlePlayEvent(socket));

    // create private room handler
    socket.on(
      'create private room',
      this.handleCreatePrivateRoomEvent(io, socket)
    );

    // update private room settings
    socket.on('update room settings', this.handleUpdateRoomSettings(socket));

    // start private game handler
    socket.on(
      'start private game',
      this.handleStartPrivateGameEvent(io, socket)
    );

    // join private room handler
    socket.on('join private room', this.handleJoinPrivateRoomEvent(io, socket));

    // start game handler
    socket.on('start game', this.handleStartGameEvent(io, socket));

    // start timer handler
    socket.on('timer', this.handleStartTimerEvent(io));

    // select word handler
    socket.on('select word', this.handleSelectWordEvent(socket));

    // leave handler
    socket.on('disconnect', this.handleLeaveEvent(socket));
  }

  handleDrawingEvent(socket) {
    return (data) => socket.broadcast.emit('drawing', data);
  }

  handleNewMessageEvent(io, socket) {
    return (data) => {
      // const bundle = {
      //   username: socket.username,
      //   message: data,
      // };
      const message = `${socket.username}: ${data}`;
      messageCache[socket.roomId] = messageCache[socket.roomId] || [];
      messageCache[socket.roomId].push(message);
      io.to(socket.roomId).emit('new message', message);
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

  handleCreatePrivateRoomEvent(io, socket) {
    return (data, callback) => {
      console.log('in create private room event');
      const roomId = randomstring.generate(9);
      socket.roomId = roomId;
      socket.join(roomId);
      data.username = data.username || nameGenerator.names.firstName();
      socket.username = data.username;
      rooms[roomId] = {
        host: data.username,
        hostId: socket.id,
        maxRound: 3,
        drawTime: 80,
        useWordsExclusive: false,
        currentRound: 0,
        users: {},
        gameStarted: false,
        numUsers: 1,
      };

      rooms[roomId].users[data.username] = 1;

      // rooms[socket.id].maxRound = data.maxRound || 2;
      // rooms[socket.id].drawTime = data.drawTime || 30;
      // rooms[socket.id].useWordsExclusive = data.useWordsExclusive;

      // if (data.words) {
      //   const words = data.words.split(',').map((word) => word.trim());
      //   if (data.useWordsExclusive) {
      //     rooms[socket.id].words = words;
      //   } else {
      //     rooms[socket.id].words = [...words, ...defaultWordList];
      //   }
      // } else {
      //   rooms[socket.id].words = defaultWordList;
      // }

      // rooms[socket.id].searchRange = rooms[socket.id].words.length - 1;

      // const randomWords = this.pickRandomWords(
      //   socket.id,
      //   rooms[socket.id].searchRange,
      //   3
      // );

      const users = Object.keys(rooms[roomId].users).map((user, idx) => {
        return {
          name: user,
          index: idx,
        };
      });

      const defaultRoomSettings = {
        roomId,
        maxRound: 3,
        drawTime: 80,
        useWordsExclusive: false,
        users,
      };

      io.to(socket.id).emit('private room created', defaultRoomSettings);

      if (callback) {
        callback(defaultRoomSettings);
      }

      console.log(rooms);
      console.log(socket.roomId);
      console.log(socket.username);
      console.log(socket.id);
    };
  }

  handleUpdateRoomSettings(socket) {
    return (data) => {
      // console.log(socket.id);
      const roomId = data.roomId || socket.roomId;
      rooms[roomId].maxRound = data.maxRound;
      rooms[roomId].drawTime = data.drawTime;
      rooms[roomId].useWordsExclusive = data.useWordsExclusive;

      socket.to(roomId).emit('room settings updated', {
        maxRound: data.maxRound,
        drawTime: data.drawTime,
        useWordsExclusive: data.useWordsExclusive,
      });
    };
  }

  handleStartPrivateGameEvent(io, socket) {
    return (data) => {
      rooms[socket.id].maxRound = data.maxRound || 2;
      rooms[socket.id].drawTime = data.drawTime || 30;
      rooms[socket.id].useWordsExclusive = data.useWordsExclusive;

      if (data.words) {
        const words = data.words.split(',').map((word) => word.trim());
        if (data.useWordsExclusive) {
          rooms[socket.id].words = words;
        } else {
          rooms[socket.id].words = [...words, ...defaultWordList];
        }
      } else {
        rooms[socket.id].words = defaultWordList;
      }

      rooms[socket.id].searchRange = rooms[socket.id].words.length - 1;
    };
  }

  handleJoinPrivateRoomEvent(io, socket) {
    return (data) => {
      const roomId = data.roomId;
      const username = data.username || nameGenerator.names.firstName();
      socket.roomId = roomId;
      socket.username = username;
      socket.join(roomId);
      rooms[roomId].users[username] = 1;
      rooms[roomId].numUsers++;
      io.to(roomId).emit('private room joined', {
        users: Object.keys(rooms[roomId].users),
      });
      io.to(socket.id).emit('private room settings', {
        maxRound: rooms[roomId].maxRound,
        drawTime: rooms[roomId].drawTime,
        useWordsExclusive: rooms[roomId].useWordsExclusive,
      });

      if (messageCache[socket.roomId])
        socket.emit('old messages', messageCache[socket.roomId]);
    };
  }

  handleStartGameEvent(io, socket) {
    return () => {
      const room = rooms[socket.roomId];
      const maxRound = room.maxRound;
      const numUsers = room.numUsers;
    };
  }

  handleStartTimerEvent(io) {
    return (data) => {
      let countdown = data + 1;
      const interval = setInterval(() => {
        countdown--;
        io.to().emit('timer', { countdown });
        if (countdown === 0) clearInterval(interval);
      }, 1000);
    };
  }

  handleSelectWordEvent(socket) {
    return (data) => {
      const roomId = data.roomId || socket.roomId;
      rooms[roomId].selectedWord = data.selectedWord;
    };
  }

  handleLeaveEvent(socket) {
    return () => {
      console.log('a client has been disconnected to the server');
      const roomId = socket.roomId;
      const username = socket.username;
      if (roomId) {
        if (rooms[roomId] && rooms[roomId].users) {
          delete rooms[roomId].users[username];
          rooms[roomId].numUsers--;
          if (rooms[roomId].numUsers === 0) {
            delete rooms[roomId];
            delete messageCache[roomId];
          }
          rooms[roomId];
        }
        const message = `${username} just left`;
        messageCache[roomId].push(message);
        socket.to(roomId).emit('new message', message);
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
      console.log(
        `random idx ${randomIndexes[i]} = ${wordList[randomIndexes[i]]}`
      );
      console.log(
        `search range idx ${searchRange - i} = ${wordList[searchRange - i]}`
      );
      [wordList[randomIndexes[i]], wordList[searchRange - i]] = [
        wordList[searchRange - i],
        wordList[randomIndexes[i]],
      ];
      console.log(
        `random idx ${randomIndexes[i]} = ${wordList[randomIndexes[i]]}`
      );
      console.log(
        `search range idx ${searchRange - i} = ${wordList[searchRange - i]}`
      );
    }

    return randomWords;
  }

  generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = EventHandler;
