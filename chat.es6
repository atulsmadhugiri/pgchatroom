// Base Firebase URL
const BASE_URL = "https://research-chat-room.firebaseio.com";

const USERS_FIREBASE = new Firebase(`${BASE_URL}/users`);

// Users needed per room
const USERS_PER_ROOM = 3;

// Time a room is open.
const ROOM_OPEN_TIME = 600000 // 10 minutes

var currentId;
var currentUser;
var currentRoom;

// Just for reference, not used.
const USER_STATES = ["waiting", "room_id", "done"];
class CurrentUser {
  constructor(id) {
    this.id = id;
    this.firebase = new Firebase(`${BASE_URL}/users/${this.id}`);
    this.pollState();
  }

  // Grab previous state from Firebase or set as waiting
  // [Minor bug]: When currentUser is set, this doesn't allow user deletion through Firebase
  pollState() {
    this.firebase.on("value", snapshot => {
      this.state = snapshot.val();
      // console.log(this.state);
      if (!this.state) { this.firebase.set("waiting"); }
    });
  }
}

class AbstractRoom {
  constructor(room_type = "abstract") {
    this.firebase = this.firebase || new Firebase(`${BASE_URL}/${room_type}`);;
    // this.users reflects firebase
    this.usersFirebase.on("value", snapshot => { this.users = snapshot.val() || {}; });
    this.pollUsers();
  }

  get numUsers() { return Object.keys(this.users).length; }
  get usersFirebase() { return this.firebase.child("users"); }

  updateFromUser(snapshot) {
    throw new Error("Can't call abstract method");
  }

  addUser(user_id) { this.usersFirebase.update({ [user_id]: true }) }
  removeUser(user_id) { this.usersFirebase.child(user_id).remove(); }

  pollUsers() {
    USERS_FIREBASE.on("child_added", this.updateFromUser.bind(this));
    USERS_FIREBASE.on("child_changed", this.updateFromUser.bind(this));
    USERS_FIREBASE.on("child_removed", snapshot => { this.removeUser(snapshot.key()); });
  }
}

class WaitingRoom extends AbstractRoom {
  constructor() {
    super("waiting");
  }

  canCreateNewRoom(user_id) { return this.numUsers === USERS_PER_ROOM - 1 && user_id === currentId; }

  handleNewUser(id) {
    if (this.canCreateNewRoom(id)) {
      console.log("Creating a new room");
      this.createNewRoom(id);
    } else {
      this.addUser(id);
    }
  }

  updateFromUser(snapshot) {
    var [id, state] = [snapshot.key(), snapshot.val()];
    console.log(`WaitingRoom: User ${id} is ${state}`);

    if (state === "waiting") {
      this.handleNewUser(id);
    } else {
      this.removeUser(id);
    }
  }

  createNewRoom(newest_user_id) {
    currentRoom = new Room();
    var user_ids = Object.keys(this.users).slice(-2).concat([newest_user_id]);
    user_ids.forEach(id => {
      USERS_FIREBASE.child(id).set(currentRoom.id);
    });
  }
}

// Global waiting room
const WAITING_ROOM = new WaitingRoom();

class Room extends AbstractRoom {
  constructor(id = undefined) {
    if (id) {
      this.firebase = new Firebase(`${BASE_URL}/rooms/${id}`);
    } else {
      this.firebase = new Firebase(`${BASE_URL}/rooms`).push();
    }
    super();
    // this.createdAt is creation time
    this.setCreatedAt();
    this.messagesFirebase = new Firebase(`${BASE_URL}/messages/${this.id}`)
    this.pollMessages();
  }

  get id() { return this.firebase.key(); }

  isOpen() { return Firebase.ServerValue.TIMESTAMP - this.createdAt > ROOM_OPEN_TIME }

  setCreatedAt() {
    var createdAtFB = this.firebase.child("createdAt");
    createdAtFB.on("value", snapshot => {
      this.createdAt = snapshot.val();
      if (!this.createdAt) { createdAtFB.set({ createdAt: Firebase.ServerValue.TIMESTAMP }); }
    });
  }

  updateFromUser(snapshot) {
    var [id, state] = [snapshot.key(), snapshot.val()];
    console.log(`Room: User ${id} is ${state}`);

    if (state === this.id) { this.addUser(id); }
    else                   { this.removeUser(id); }
  }

  sendMessage(user_id, message) {
    this.messagesFirebase.push({ user_id, message });
  }

  pollMessages() {
    this.messagesFirebase.limitToLast(10).on("child_added", snapshot => {
      var data = snapshot.val();
      var [user_id, message] = [data.user_id, data.message];

      // Create mesage dom element
      var messageElement = $("<li>");
      var nameElement = $("<strong class='chatUserid'></strong>")
      nameElement.text(user_id);
      messageElement.text(message).prepend(nameElement);

      // Append it to the list of messages
      MESSAGE_LIST.append(messageElement)

      // Scroll to bottom of messages
      MESSAGE_LIST[0].scrollTop = MESSAGE_LIST[0].scrollHeight;
    });
  }
}

// Dom elements
const MESSAGE_INPUT = $("#messageInput");
const USER_ID_INPUT = $("#userId");
const MESSAGE_LIST = $("#messages");

// Id entered should => new User
USER_ID_INPUT.keypress(e => {
  currentId = USER_ID_INPUT.val();
  if (e.keyCode === 13 && currentId) {
    currentUser = new CurrentUser(currentId);
  }
});

// Send message when entered
MESSAGE_INPUT.keypress(function (e) {
  if (e.keyCode === 13) {
    var message = MESSAGE_INPUT.val();
    currentRoom.sendMessage(currentId, message);

    // Blank input
    MESSAGE_INPUT.val("");
  }
});
