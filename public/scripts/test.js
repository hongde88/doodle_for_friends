'use strict';

let socket = null;

function connect() {
  socket = io();
  socket.on('timer', function (data) {
    document.getElementById('timer').innerHTML = data.countdown;
  });
  socket.on('join', function (data) {
    document.getElementById('join').innerHTML = data.username + ' just joined.';
  });
  socket.on('leave', function (data) {
    document.getElementById('leave').innerHTML = data.username + ' just left.';
  });
  socket.on('new message', function (data) {
    addChatMessage(data);
  });
  socket.on('private', function (data) {
    document.getElementById(
      'private'
    ).innerHTML = `roomId = ${data.roomId} ; random words = ${data.randomWords}`;
  });
  socket.on('old messages', function (data) {
    const messages = data.room;
    for (let i = 0; i < messages.length; i++) {
      addChatMessage(messages[i]);
    }
  });
}

function startTimer() {
  socket.emit('timer', 100);
}

function playGame() {
  socket.emit('play', {});
}

function sendChat(e) {
  e = e || window.event;
  if (e.keyCode === 13) {
    const elem = e.srcElement || e.target;
    if (elem.value !== '') socket.emit('new message', elem.value);
    elem.value = '';
  }
}

function addChatMessage(data) {
  const ul = document.getElementById('messages');
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(data.username + ': ' + data.message));
  ul.appendChild(li);
}

function createPrivateRoom() {
  socket.emit('private', {
    username: 'test',
    rounds: 3,
    timer: 120,
    exclusive: true,
  });
}

function createPrivateRoomWithWords() {
  socket.emit('private', {
    username: 'test',
    rounds: 3,
    timer: 120,
    exclusive: false,
    words: 'boy, girl, son',
  });
}

// function connect() {
//   console.log('connect()');
//   // noinspection JSUnresolvedFunction
//   socket = io();
//   socket.on('connect', function (inData) {
//     console.log('MSG: connect');
//   });
//   socket.on('created', created);
//   socket.on('joined', joined);
//   socket.on('left', left);
//   socket.on('kicked', kicked);
//   socket.on('posted', posted);
//   socket.on('closed', closed);
//   socket.on('invited', invited);
// }

// // ------------------------------ BUTTON CLICK HANDLERS. ------------------------------

// function validate() {
//   console.log('validate()');
//   socket.emit(
//     'validate',
//     { userName: 'fzammetti', password: 'newage' },
//     function (inData) {
//       console.log(`validate() callback: inData = ${JSON.stringify(inData)}`);
//     }
//   );
// }

// function listUsers() {
//   console.log('listUsers()');
//   socket.emit('listUsers', {}, function (inData) {
//     console.log(`listUsers() callback: inData = ${JSON.stringify(inData)}`);
//   });
// }

// function create() {
//   console.log('create()');
//   socket.emit(
//     'create',
//     {
//       roomName: 'Computer Chat',
//       description: 'Talk about computers',
//       maxPeople: 10,
//       private: false,
//       creator: 'fzammetti',
//     },
//     function (inData) {
//       console.log(`create() callback: inData = ${JSON.stringify(inData)}`);
//     }
//   );
// }

// function listRooms() {
//   console.log('listRooms()');
//   socket.emit('listRooms', {}, function (inData) {
//     console.log(`listRooms() callback: inData = ${JSON.stringify(inData)}`);
//   });
// }

// function join() {
//   console.log('join()');
//   socket.emit(
//     'join',
//     { userName: 'fzammetti', roomName: 'Computer Chat' },
//     function (inData) {
//       console.log(`join() callback: inData = ${JSON.stringify(inData)}`);
//     }
//   );
// }

// function leave() {
//   console.log('leave()');
//   socket.emit(
//     'leave',
//     { userName: 'fzammetti', roomName: 'Computer Chat' },
//     function (inData) {
//       console.log(`leave() callback: inData = ${JSON.stringify(inData)}`);
//     }
//   );
// }

// function kick() {
//   console.log('kick()');
//   socket.emit(
//     'kick',
//     { userName: 'fzammetti', roomName: 'Computer Chat' },
//     function (inData) {
//       console.log(`kick() callback: inData = ${JSON.stringify(inData)}`);
//     }
//   );
// }

// function postMsg() {
//   console.log('postMsg()');
//   socket.emit(
//     'post',
//     {
//       userName: 'fzammetti',
//       roomName: 'Computer Chat',
//       message: 'Hello room!',
//     },
//     function (inData) {
//       console.log(`post() callback: inData = ${JSON.stringify(inData)}`);
//     }
//   );
// }

// function closeRoom() {
//   console.log('closeRoom()');
//   socket.emit('close', { roomName: 'Computer Chat' }, function (inData) {
//     console.log(`closeRoom() callback: inData = ${JSON.stringify(inData)}`);
//   });
// }

// function invite() {
//   console.log('invite()');
//   socket.emit(
//     'invite',
//     {
//       userName: 'fzammetti',
//       roomName: 'Computer Chat',
//       inviterName: 'fzammetti',
//     },
//     function (inData) {
//       console.log(`invite() callback: inData = ${JSON.stringify(inData)}`);
//     }
//   );
// }

// // ------------------------------ BROADCAST MESSAGE HANDLERS. ------------------------------

// function created(inData) {
//   console.log('MSG: created');
//   console.log(inData);
// }

// function joined(inData) {
//   console.log('MSG: joined');
//   console.log(inData);
// }

// function left(inData) {
//   console.log('MSG: left');
//   console.log(inData);
// }

// function kicked(inData) {
//   console.log('MSG: kicked');
//   console.log(inData);
// }

// function posted(inData) {
//   console.log('MSG: posted');
//   console.log(inData);
// }

// function closed(inData) {
//   console.log('MSG: closed');
//   console.log(inData);
// }

// function invited(inData) {
//   console.log('MSG: invited');
//   console.log(inData);
// }
