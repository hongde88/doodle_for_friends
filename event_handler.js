const nameGenerator = require('fakerator')();

const messageCache = { room: [] };

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

    // private room handler
    socket.on('private', this.handlePrivateRoomEvent(io, socket));

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
        currentRound: 0,
        users: [data.username],
      };

      if (data.words) {
        const words = data.words.split(',').map((word) => word.trim());
        if (data.exclusive) {
          rooms[socket.id].words = words;
        } else {
          rooms[socket.id].words = [...words, ...defaultWordList];
        }
      } else {
        rooms[socket.id].words = defaultWordList;
      }

      rooms[socket.id].searchRange = rooms[socket.id].words.length - 1;

      const randomWords = this.pickRandomWords(
        socket.id,
        rooms[socket.id].searchRange,
        3
      );

      io.to(socket.id).emit('private', {
        roomId: socket.id,
        numberOfWords: rooms[socket.id].searchRange + 1,
        randomWords,
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

  handleSelectWordEvent(socket) {
    return (data) => {
      const roomId = data.roomId || socket.roomId;
      rooms[roomId].selectedWord = data.selectedWord;
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
