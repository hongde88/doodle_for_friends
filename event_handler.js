const nameGenerator = require('fakerator')(); // generate random names for users

const randomstring = require('randomstring'); // generate room ids

const messageCache = {}; // cache room messages in memory

const rooms = {}; // cache game rooms

class EventHandler {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  handleGameEvents() {
    // drawing handler
    this.socket.on('drawing', this.handleDrawingEvent());

    // chat handler
    this.socket.on('new message', this.handleNewMessageEvent());

    // create private room handler
    this.socket.on('create private room', this.handleCreatePrivateRoomEvent());

    // update private room settings
    this.socket.on('update room settings', this.handleUpdateRoomSettings());

    // start private game handler
    this.socket.on('start private game', this.handleStartPrivateGameEvent());

    // join private room handler
    this.socket.on('join private room', this.handleJoinPrivateRoomEvent());

    // start guessing timer handler - countdown timer displayed in game room
    this.socket.on(
      'start guessing timer',
      this.handleStartGuessingTimerEvent()
    );

    // word picked handler
    this.socket.on('word picked', this.handleWordPickedByPlayer());

    // start timer for choosing word
    // this.socket.on('start choosing timer', this.handleStartChoosingTimer());

    // disconnect handler
    this.socket.on(
      'disconnect',
      this.handleDisconnectOrLeaveEvent('disconnect')
    );

    // leave handler
    this.socket.on('leave', this.handleDisconnectOrLeaveEvent('leave'));
  }

  // handleSetGameState(roomId, state, word) {
  //   if (rooms[roomId]) {
  //     rooms[roomId].gameState = state;
  //   }

  //   this.io.to(roomId).emit('in game', {
  //     gameState: state,
  //     wordLength: word ? word.length : 0,
  //   });
  // }
  handleSetGameState(roomId, state, data) {
    if (rooms[roomId]) {
      rooms[roomId].gameState = state;
    }

    this.io.to(roomId).emit('in game', {
      gameState: state,
      ...data,
    });
  }

  handleWordPickedByPlayer() {
    return (data) => {
      const roomId = this.socket.roomId;

      if (!roomId) {
        return;
      }

      rooms[roomId].selectedWord = data;
      rooms[roomId].wordHint = data.replace(/[a-zA-Z]/g, '_').split('');

      this.handleSetGameState(roomId, 'drawing', {
        wordHint: rooms[roomId].wordHint.join(' '),
      });
    };
  }

  // handleStartChoosingTimer() {
  //   return (data, callback) => {
  //     const roomId = this.socket.roomId;
  //     if (roomId && rooms[roomId]) {
  //       let remainingTime = data + 1;

  //       const interval = setInterval(() => {
  //         remainingTime--;

  //         this.socket.emit('word picking remaining time', { remainingTime });

  //         if (remainingTime === 0) {
  //           clearInterval(interval);

  //           let randomWord = null;
  //           if (rooms[roomId] && !rooms[roomId].currentWord) {
  //             // word not chosen yet, then pick a random word
  //             randomWord =
  //               rooms[roomId].currentWordList[this.generateRandomNumber(0, 2)];
  //           }

  //           callback(randomWord);

  //           this.handleSetGameState(roomId, 'drawing', {
  //             wordLength: randomWord ? randomWord.length : 0,
  //           });
  //         }
  //       }, 1000);
  //     }
  //   };
  // }

  handleDrawingEvent() {
    return (data) => this.socket.broadcast.emit('drawing', data);
  }

  handleNewMessageEvent() {
    return (data) => {
      const username = data.username || this.socket.username;
      const roomId = data.roomId || this.socket.roomId;
      if (!rooms[roomId]) return;
      let message = `${username}: ${data.message}`;
      messageCache[roomId] = messageCache[roomId] || [];

      // check the answer
      if (
        rooms[roomId] &&
        rooms[roomId].gameState === 'drawing' &&
        rooms[roomId].guessRemainingTime > 0
      ) {
        if (rooms[roomId].selectedWord.includes(data.message)) {
          if (!rooms[roomId].correctGuessUsers.includes(username)) {
            message = `${username} guessed the word`;
            rooms[roomId].correctGuessUsers.push(username);
          } else {
            message = 'You already guessed the word';
            this.socket.emit('new message', message);
            return;
          }
          console.log(rooms[roomId].correctGuessUsers);
        }
      }

      messageCache[roomId].push(message);
      this.io.to(roomId).emit('new message', message);
    };
  }

  handleCreatePrivateRoomEvent() {
    return (data, callback) => {
      const roomId = randomstring.generate(9);
      this.socket.roomId = roomId;
      this.socket.join(roomId);
      data.username = data.username || nameGenerator.names.firstName();
      this.socket.username = data.username;
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
        correctGuessUsers: [],
        words: defaultWordList,
      };

      rooms[roomId].searchRange = rooms[roomId].words.length - 1;

      rooms[roomId].users[data.username] = { avatarIndex, id: this.socket.id };

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

  handleUpdateRoomSettings() {
    return (data, callback) => {
      const roomId = data.roomId || this.socket.roomId;

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

        rooms[roomId].searchRange = rooms[roomId].words.length - 1;
      }

      const newSettings = {
        maxRound: data.maxRound,
        drawTime: data.drawTime,
        exclusive: data.exclusive,
      };

      this.socket.to(roomId).emit('room settings updated', newSettings);

      if (callback) {
        callback(newSettings);
      }
    };
  }

  handleStartPrivateGameEvent() {
    return () => {
      const roomId = this.socket.roomId;
      if (rooms[roomId]) {
        const currentRound = 1;
        rooms[roomId].currentRound = currentRound;

        const currentPlayerIdx = 0;
        rooms[roomId].currentPlayerIdx = currentPlayerIdx;

        const currentPlayerName = this.generateUserList(roomId)[
          currentPlayerIdx
        ].name;
        rooms[roomId].currentPlayer = currentPlayerName;

        const currentPlayerSocketId = rooms[roomId].users[currentPlayerName].id;
        const currentSearchRange = rooms[roomId].searchRange;

        const randomWords = this.pickRandomWords(roomId, currentSearchRange, 3);

        rooms[roomId].currentWordList = randomWords;

        // update search range
        rooms[roomId].searchRange = currentSearchRange - 3;

        this.io.to(roomId).emit('set game started');

        // setTimeout(() => {
        // rooms[roomId].gameState = 'starting';
        // this.io.to(roomId).emit('in game', {
        //   currentRound,
        //   gameState: 'starting',
        // });
        // }, 1000);
        this.handleSetGameState(roomId, 'starting', {
          currentRound,
        });

        setTimeout(() => {
          // rooms[roomId].gameState = 'choosing';

          this.io.to(currentPlayerSocketId).emit('pick words', randomWords);

          // this.io.to(roomId).emit('in game', {
          //   currentPlayerName,
          //   gameState: 'choosing',
          // });
          this.handleSetGameState(roomId, 'choosing', {
            currentPlayerName,
          });
        }, 2000);
      }
    };
  }

  handleJoinPrivateRoomEvent() {
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
          return this.socket.emit('room does not exist');
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
            return this.socket.emit('name exists');
          }
        }
      }

      this.socket.roomId = roomId;
      this.socket.username = username;
      this.socket.join(roomId);
      rooms[roomId].users[username] = { avatarIndex, id: this.socket.id };
      rooms[roomId].numUsers++;
      this.io.to(roomId).emit('private room joined', {
        users: this.generateUserList(roomId),
        maxRound: rooms[roomId].maxRound,
        drawTime: rooms[roomId].drawTime,
        exclusive: rooms[roomId].exclusive,
        roomId,
        playable: rooms[roomId].numUsers > 1,
        host: rooms[roomId].host,
        gameStarted: rooms[roomId].gameStarted,
        numUsers: rooms[roomId].numUsers,
        gameState: rooms[roomId].gameState,
      });

      if (callback) {
        callback({
          username,
          isHost: username === rooms[roomId].host,
        });
      }

      if (messageCache[roomId])
        this.socket.emit('old messages', messageCache[roomId]);
    };
  }

  handleStartGuessingTimerEvent() {
    return (data) => {
      const roomId = data.roomId || this.socket.roomId;

      if (roomId) {
        rooms[roomId].guessRemainingTime = data.duration;

        rooms[roomId].guessingInterval = setInterval(() => {
          // console.log(roomId);
          if (!rooms[roomId]) {
            clearInterval(interval);
            return;
          }
          rooms[roomId].guessRemainingTime--;
          this.io.to(roomId).emit('guessing timer remaining', {
            remainingTime: rooms[roomId].guessRemainingTime,
          });
          if (rooms[roomId].guessRemainingTime === 0) {
            clearInterval(rooms[roomId].guessingInterval);
            rooms[roomId].guessingInterval = false;
            setTimeout(() => {
              // console.log(roomId);
              this.io.to(roomId).emit('result', {
                selectedWord: rooms[roomId].selectedWord,
                scores: [],
              });
            }, 1000);
          }
        }, 1000);
      }
    };
  }

  handleSelectWordEvent() {
    return (data) => {
      const roomId = data.roomId || this.socket.roomId;
      rooms[roomId].selectedWord = data.selectedWord;
    };
  }

  handleDisconnectOrLeaveEvent(type) {
    return () => {
      if (type === 'disconnect') {
        console.log(
          `a client ${this.socket.id} has been disconnected from the server`
        );
      } else {
        console.log(
          `a client ${this.socket.id} has left the room ${this.socket.roomId}`
        );
      }
      const roomId = this.socket.roomId;
      const username = this.socket.username;
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
          this.socket.to(roomId).emit('user left', {
            host: rooms[roomId].host,
            playable: rooms[roomId].numUsers > 1,
            users: this.generateUserList(roomId),
          });
          const message = `${username} just left.`;
          if (messageCache[roomId]) {
            messageCache[roomId].push(message);
          }
          this.socket.to(roomId).emit('new message', message);
        }

        this.socket.leave(roomId);
        this.socket.roomId = null;
        this.socket.username = null;
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
