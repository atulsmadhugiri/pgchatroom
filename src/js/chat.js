import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import ChatApp from './chat/components/chat-app';

$(() => {
  ReactDOM.render(
    <ChatApp />,
    document.getElementById('chat-app')
  );
});

// import Firebase from 'firebase';

// import CHAT_CONSTANTS from './chat/constants';
// import Messaging from './chat/messaging';
// import Room from './chat/room';

// const currentId = CHAT_CONSTANTS.USER_ID;
// let currentUser;
// let currentRoom;

// let ROOM_OPEN_TIME;
// let WARNING;
// let USERS_PER_ROOM;
// let MAX_WAITING_TIME;

// const CONST_FIREBASE = new Firebase(`https://research-chat-room.firebaseio.com/constants`);

// // Global waiting room
// const WAITING_ROOM = new WaitingRoom();

// CONST_FIREBASE.on('value', snapshot => {
//   const values = snapshot.val();

//   ROOM_OPEN_TIME = values.roomOpenTime;
//   WARNING = values.warning;
//   USERS_PER_ROOM = values.usersPerRoom;
//   MAX_WAITING_TIME = values.maxWaitingTime;

//   // Id entered should => new User
//   currentUser = new CurrentUser(currentId);
//   console.log(currentUser);
//   USER_ID_INPUT.val(currentId);
//   USER_ID_INPUT.prop('disabled', true);

//   // Send message when entered
//   MESSAGE_INPUT.keypress((e) => {
//     if (e.keyCode === 13) {
//       const message = MESSAGE_INPUT.val();
//       currentRoom.sendMessage(currentId, message);

//       // Blank input
//       MESSAGE_INPUT.val('');
//     }
//   });
// });
