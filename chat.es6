// Base Firebase URL
const BASE_URL = "https://research-chat-room.firebaseio.com";

class WaitingRoom {
  constructor() {
    this.firebase = new Firebase(`${BASE_URL}/waiting`);
    this.firebase.on("value", snapshot => {
      this.users = snapshot.val();
    });
  }
}

const WAITING_ROOM = new WaitingRoom();

class CurrentUser {
  constructor(id) {
    this.id = id;
    this.firebase = new Firebase(`${BASE_URL}/users/${this.id}`);
    this.pullInfoAndSetState();
  }

  // Grab previous info from Firebase or create a new user
  pullInfoAndSetState() {
    this.firebase.once("value", snapshot => {
      this.state = snapshot.val();
      // If new user, initialize everything properly
      if (!snapshot.val()) {
        this.state = "waiting";
        this.addToWaiting();
      }
    });
  }

  // Adds a new user to waiting room and creates a new chat room if possible
  addToWaiting() {
    this.firebase.set("waiting");
    var waiting = new Firebase(`${BASE_URL}/waiting`);
    waiting.update({ [this.id]: true });
  }
}

class Room {
  constructor() {

  }
}

// REGISTER DOM ELEMENTS
const MESSAGE_INPUT = $("#messageInput");
const USER_ID = $("#userId");
const MESSAGE_LIST = $("#messages");

var currentUser;
USER_ID.keypress(e => {
  var user_id = USER_ID.val()
  if (e.keyCode === 13 && user_id) {
    currentUser = new CurrentUser(user_id);
  }
});

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
