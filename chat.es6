// Base Firebase URL
const BASE_URL = "https://research-chat-room.firebaseio.com";

var currentId;
var currentUser;

// Just for reference, not used.
const USER_STATES = ["waiting", "room_id", "done"];
class CurrentUser {
  constructor(id) {
    this.id = id;
    this.firebase = new Firebase(`${BASE_URL}/users/${this.id}`);
    this.pollState();
  }

  // Grab previous state from Firebase or set as waiting
  pollState() {
    this.firebase.on("value", snapshot => {
      this.state = snapshot.val();
      // console.log(this.state);
      if (!this.state) { this.firebase.set("waiting"); }
    });
  }
}

class AbstractRoom {
  constructor(room_type="abstract") {
    this.firebase = this.firebase || new Firebase(`${BASE_URL}/${room_type}`);;
    // this.users reflects firebase
    this.usersFirebase.on("value", snapshot => { this.users = snapshot.val() || {}; });
    this.pollUsers();
  }

  get numUsers() { return Object.keys(this.users).length; }
  get usersFirebase() { return this.firebase.child("users"); }

  updateFromUsers(snapshot) {
    throw new Error("Can't call abstract method");
  }

  removeUser(user_id) { this.usersFirebase.child(user_id).remove(); }

  pollUsers() {
    const USERS_FIREBASE = new Firebase(`${BASE_URL}/users`);;
    USERS_FIREBASE.on("child_added", this.updateFromUsers.bind(this));
    USERS_FIREBASE.on("child_changed", this.updateFromUsers.bind(this));
    USERS_FIREBASE.on("child_removed", (snapshot) => { this.removeUser(snapshot.key()); });
  }
}

class WaitingRoom extends AbstractRoom {
  constructor() {
    super("waiting");
  }

  updateFromUsers(snapshot) {
    var [id, state] = [snapshot.key(), snapshot.val()];
    console.log(`WaitingRoom: User ${id} is ${state}`);

    if (state === "waiting") {
      if (this.numUsers === 2 && id === currentId)
        console.log("Make a new room");
      this.firebase.child("users").update({ [id]: true });
    } else {
      this.removeUser(id);
    }
  }
}

// Global waiting room
const WAITING_ROOM = new WaitingRoom();

class Room extends AbstractRoom {
  constructor() {
    this.firebase = new Firebase(`${BASE_URL}/rooms`).push();
    this.id = this.firebase.key();
    this.firebase.update({ createdAt: Firebase.ServerValue.TIMESTAMP });
    super();
  }

  updateFromUsers(snapshot) {
    var [id, state] = [snapshot.key(), snapshot.val()];
    console.log(`Room: User ${id} is ${state}`);

    if (state === this.id) {

    }
  }
}

// REGISTER DOM ELEMENTS
const MESSAGE_INPUT = $("#messageInput");
const USER_ID = $("#userId");
const MESSAGE_LIST = $("#messages");

USER_ID.keypress(e => {
  currentId = USER_ID.val();
  if (e.keyCode === 13 && currentId) {
    currentUser = new CurrentUser(currentId);
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
