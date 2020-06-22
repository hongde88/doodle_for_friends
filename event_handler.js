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
      rooms[roomId].wordHintIdx = {};

      this.handleSetGameState(roomId, 'drawing', {
        wordHint: rooms[roomId].wordHint.join(' '),
      });

      this.io.to(roomId).emit('new message', {
        message: `${this.socket.username} is drawing now.`,
        color: 'blue',
      });
    };
  }

  handleStartChoosingTimer() {
    return (data, callback) => {
      const roomId = this.socket.roomId;
      if (roomId && rooms[roomId]) {
        let remainingTime = data + 1;

        const choosingInterval = setInterval(() => {
          remainingTime--;

          this.socket.emit('word picking remaining time', { remainingTime });

          if (rooms[roomId] && rooms[roomId].selectedWord) {
            clearInterval(choosingInterval);
            return;
          }

          if (remainingTime === 0) {
            clearInterval(choosingInterval);

            let randomWord = null;
            if (rooms[roomId] && !rooms[roomId].selectedWord) {
              // word not chosen yet, then pick a random word
              randomWord =
                rooms[roomId].currentWordList[this.generateRandomNumber(0, 2)];

              rooms[roomId].selectedWord = randomWord;
              rooms[roomId].wordHint = randomWord
                .replace(/[a-zA-Z]/g, '_')
                .split('');

              if (callback) {
                callback({
                  word: randomWord,
                  duration: rooms[roomId].drawTime,
                  roomId: roomId,
                });
              }

              this.handleSetGameState(roomId, 'drawing', {
                wordHint: rooms[roomId].wordHint.join(' '),
              });

              this.io.to(roomId).emit('new message', {
                message: `${this.socket.username} is drawing now.`,
                color: 'blue',
              });
            }
          }
        }, 1000);
      }
    };
  }

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
      let color = 'black';

      // check answer
      const correctGuess = this.checkAnswer(
        roomId,
        username,
        data.message,
        color
      );

      if (correctGuess) return;

      messageCache[roomId].push({ message, color: 'black' });
      this.io.to(roomId).emit('new message', { message, color: 'black' });
    };
  }

  checkAnswer(roomId, username, message, color) {
    // check the answer
    if (
      rooms[roomId] &&
      rooms[roomId].gameState === 'drawing' &&
      rooms[roomId].guessRemainingTime > 0
    ) {
      if (
        rooms[roomId].selectedWord.toUpperCase().includes(message.toUpperCase())
      ) {
        if (rooms[roomId].currentPlayer === username) {
          // the current drawer is typing the answer. Hide it from others.
          this.io.to(rooms[roomId].users[username].id).emit('new message', {
            message: `${username}: ${message}`,
            color: 'green',
          });

          return true;
        }

        if (!rooms[roomId].correctGuessUsers[username]) {
          message = `${username} guessed the word`;
          rooms[roomId].correctGuessUsers[username] = {
            // username,
            points: rooms[roomId].guessRemainingTime,
          };
          color = 'green';
          messageCache[roomId].push({ message, color });
          this.socket.broadcast.emit('new message', {
            message,
            color,
          });
          message = 'You guessed the word';
          this.socket.emit('new message', {
            message,
            color,
          });
        } else {
          message = 'You already guessed the word';
          color = 'orange';
          this.socket.emit('new message', {
            message,
            color,
          });
        }

        // check if turn is over
        const turnIsOver = this.checkIfTurnIsOver(roomId);

        if (turnIsOver) {
          this.calculateTurnScoreAndBroadcast(roomId);
        }

        return true;
      }
    }

    return false;
  }

  calculateTurnScoreAndBroadcast(roomId) {
    if (roomId && rooms[roomId]) {
      const drawingBaseScore = Math.ceil(
        rooms[roomId].drawTime / rooms[roomId].numUsers
      );
      const scoreBoard = [];

      // calculate score for drawer
      let points = 0;
      const correctGuessUsers = rooms[roomId].correctGuessUsers;

      for (const key in correctGuessUsers) {
        points += drawingBaseScore;
        scoreBoard.push({
          name: key,
          points: correctGuessUsers[key].points,
        });
        rooms[roomId].users[key].totalPoints += correctGuessUsers[key].points;
      }

      if (!rooms[roomId].isCurrentPlayerLeft) {
        scoreBoard.push({
          name: rooms[roomId].currentPlayer,
          points,
        });
        rooms[roomId].users[rooms[roomId].currentPlayer].totalPoints += points;
      }

      if (scoreBoard.length > 0) {
        scoreBoard.sort((a, b) => b.points - a.points);
      } else {
        for (const key in rooms[roomId].users) {
          scoreBoard.push({
            name: key,
            points: 0,
          });
        }
      }

      this.handleSetGameState(roomId, 'show turn result', {
        turnWord: rooms[roomId].selectedWord,
        scoreBoard,
        finalScoreBoard: Object.keys(rooms[roomId].users)
          .map((user) => ({
            name: user,
            totalPoints: rooms[roomId].users[user].totalPoints,
          }))
          .sort((a, b) => b.totalPoints - a.totalPoints),
      });

      // reset everything for the next turn
      this.cleanUpPreviousTurn(roomId);
      if (rooms[roomId].currentPlayerIdx < rooms[roomId].numUsers - 1) {
        // next turn
        const currentPlayerIdx = rooms[roomId].currentPlayerIdx + 1;
        rooms[roomId].currentPlayerIdx = currentPlayerIdx;
        this.startTurnOrRound(roomId, currentPlayerIdx, false, false);
      } else if (rooms[roomId].currentRound < rooms[roomId].maxRound) {
        // next round
        rooms[roomId].currentRound++;
        const currentPlayerIdx = 0;
        rooms[roomId].currentPlayerIdx = currentPlayerIdx;
        setTimeout(() => {
          this.startTurnOrRound(
            roomId,
            currentPlayerIdx,
            true,
            false,
            rooms[roomId].currentRound
          );
        }, 4000);
      } else {
        // end game
        // game is over display the final points
        setTimeout(() => {
          if (roomId && rooms[roomId]) {
            this.handleSetGameState(roomId, 'game ended', {
              finalScoreBoard: Object.keys(rooms[roomId].users)
                .map((user) => ({
                  name: user,
                  totalPoints: rooms[roomId].users[user].totalPoints,
                }))
                .sort((a, b) => b.totalPoints - a.totalPoints),
            });
          }
        }, 4000);
      }
    }
  }

  cleanUpPreviousTurn(roomId) {
    if (roomId && rooms[roomId]) {
      delete rooms[roomId].correctGuessUsers;
      rooms[roomId].correctGuessUsers = {};
      delete rooms[roomId].currentWordList;
      delete rooms[roomId].guessingInterval;
      delete rooms[roomId].selectedWord;
      delete rooms[roomId].wordHint;
      delete rooms[roomId].wordHintIdx;
      const currentPlayerName = rooms[roomId].currentPlayer;
      if (currentPlayerName && rooms[roomId].users[currentPlayerName]) {
        const currentPlayerSocketId = rooms[roomId].users[currentPlayerName].id;
        this.io.to(currentPlayerSocketId).emit('clear current player');
        this.io.to(roomId).emit('reset room word hint');
      }
    }
  }

  checkIfTurnIsOver(roomId) {
    if (
      rooms[roomId] &&
      rooms[roomId].gameState === 'drawing' &&
      rooms[roomId].guessRemainingTime > 0
    ) {
      const currentPlayer = rooms[roomId].currentPlayer;
      const correctGuessNum = Object.keys(rooms[roomId].correctGuessUsers)
        .length;
      const usersInRoomNum = rooms[roomId].numUsers;

      if (
        !rooms[roomId].correctGuessUsers[currentPlayer] &&
        correctGuessNum === usersInRoomNum - 1
      ) {
        if (rooms[roomId].guessingInterval) {
          rooms[roomId].guessRemainingTime = 0;
          clearInterval(rooms[roomId].guessingInterval);
        }
        return true;
      }
    }

    return false;
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
        correctGuessUsers: {},
        words: defaultWordList,
      };

      rooms[roomId].searchRange = rooms[roomId].words.length - 1;

      rooms[roomId].users[data.username] = {
        avatarIndex,
        id: this.socket.id,
        totalPoints: 0,
      };

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

        this.startTurnOrRound(
          roomId,
          currentPlayerIdx,
          true,
          true,
          currentRound
        );
      }
    };
  }

  startTurnOrRound(
    roomId,
    currentPlayerIdx,
    isStartingRound,
    setGameStarted,
    currentRound
  ) {
    const currentPlayerName = this.generateUserList(roomId)[currentPlayerIdx]
      .name;
    rooms[roomId].currentPlayer = currentPlayerName;

    const currentPlayerSocketId = rooms[roomId].users[currentPlayerName].id;
    const currentSearchRange = rooms[roomId].searchRange;

    const randomWords = this.pickRandomWords(roomId, currentSearchRange, 3);

    rooms[roomId].currentWordList = randomWords;

    // update search range
    rooms[roomId].searchRange = currentSearchRange - 3;

    if (setGameStarted) {
      this.io.to(roomId).emit('set game started');
    }

    if (isStartingRound) {
      this.handleSetGameState(roomId, 'starting', {
        currentRound,
      });
    }

    setTimeout(() => {
      this.io.to(currentPlayerSocketId).emit('pick words', randomWords);

      this.handleSetGameState(roomId, 'choosing', {
        currentPlayerName,
      });
    }, 2000);
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
      rooms[roomId].users[username] = {
        avatarIndex,
        id: this.socket.id,
        totalPoints: 0,
      };
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
          if (!rooms[roomId]) {
            return;
          }

          rooms[roomId].guessRemainingTime--;

          if (rooms[roomId].guessRemainingTime >= 0) {
            this.io.to(roomId).emit('guessing timer remaining', {
              remainingTime: rooms[roomId].guessRemainingTime,
            });
          }

          if (
            rooms[roomId].guessRemainingTime ===
            Math.ceil(rooms[roomId].drawTime / 2)
          ) {
            this.revealHint(roomId);
          }

          if (
            rooms[roomId].guessRemainingTime ===
            Math.ceil(rooms[roomId].drawTime / 4)
          ) {
            this.revealHint(roomId);
          }

          if (rooms[roomId].guessRemainingTime <= 0) {
            clearInterval(rooms[roomId].guessingInterval);
            rooms[roomId].guessingInterval = false;
            this.calculateTurnScoreAndBroadcast(roomId);
          }
        }, 1000);
      }
    };
  }

  revealHint(roomId) {
    if (roomId && rooms[roomId]) {
      const selectedWord = rooms[roomId].selectedWord;
      let idx = 0;
      let found = false;

      do {
        idx = this.generateRandomNumber(0, selectedWord.length);
        if (
          selectedWord &&
          selectedWord[idx] !== ' ' &&
          rooms[roomId] &&
          rooms[roomId].wordHintIdx &&
          !rooms[roomId].wordHintIdx[idx]
        ) {
          rooms[roomId].wordHintIdx[idx] = true;
          found = true;
        }
      } while (!found);

      rooms[roomId].wordHint[idx] = selectedWord[idx];

      this.handleSetGameState(roomId, 'drawing', {
        wordHint: rooms[roomId].wordHint.join(' '),
      });
    }
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
          if (rooms[roomId] && rooms[roomId].numUsers === 0) {
            if (rooms[roomId].guessingInterval) {
              clearInterval(rooms[roomId].guessingInterval);
            }
            delete rooms[roomId];
            delete messageCache[roomId];
            return;
          } else {
            if (username === rooms[roomId].host) {
              rooms[roomId].host = Object.keys(rooms[roomId].users)[0];
            }
            if (
              username === rooms[roomId].currentPlayer &&
              rooms[roomId].guessRemainingTime >= 0
            ) {
              rooms[roomId].isCurrentPlayerLeft = true;
              this.calculateTurnScoreAndBroadcast(roomId);
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
            messageCache[roomId].push({ message, color: 'red' });
          }
          this.socket.to(roomId).emit('new message', { message, color: 'red' });
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
