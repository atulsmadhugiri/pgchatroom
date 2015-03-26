// CREATE A REFERENCE TO FIREBASE
var FIREBASE = new Firebase("https://research-chat-room.firebaseio.com/");

// REGISTER DOM ELEMENTS
var MESSAGE_INPUT = $("#messageInput");
var USER_ID = $("#userId");
var MESSAGE_LIST = $("#messages");



// LISTEN FOR KEYPRESS EVENT
// MESSAGE_INPUT.keypress(function (e) {
//   if (e.keyCode == 13) {
//     //FIELD VALUES
//     var username = USER_ID.val();
//     var message = MESSAGE_INPUT.val();

//     //SAVE DATA TO FIREBASE AND EMPTY FIELD
//     FIREBASE.push({name: username, text: message});
//     MESSAGE_INPUT.val('');
//   }
// });

// // Add a callback that is triggered for each chat message.
// FIREBASE.limitToLast(10).on('child_added', function (snapshot) {
//   //GET DATA
//   var data = snapshot.val();
//   var username = data.name || "anonymous";
//   var message = data.text;

//   //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
//   var messageElement = $("<li>");
//   var nameElement = $("<strong class='example-chat-username'></strong>")
//   nameElement.text(username);
//   messageElement.text(message).prepend(nameElement);

//   //ADD MESSAGE
//   MESSAGE_LIST.append(messageElement)

//   //SCROLL TO BOTTOM OF MESSAGE LIST
//   MESSAGE_LIST[0].scrollTop = MESSAGE_LIST[0].scrollHeight;
// });
