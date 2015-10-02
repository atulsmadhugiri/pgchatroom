/*eslint-disable */
import Firebase from 'firebase';
import $ from 'jquery';

// Grab room from URL
const URL_REGEX = /room=(\w+)/;
const ROOM_PARAMS = URL_REGEX.exec(location.search);
if (!ROOM_PARAMS) { throw new Error('Missing room in URL!'); }
const ROOM = ROOM_PARAMS[1];

// Grab user_id from URL
const USER_ID_REGEX = /user_id=(\w+)/;
const USER_ID_PARAMS = USER_ID_REGEX.exec(location.search);
if (!USER_ID_PARAMS) { throw new Error('Missing user_id in URL!'); }
const USER_ID = USER_ID_PARAMS[1];

// Base Firebase URL
const BASE_URL = `https://research-chat-room.firebaseio.com/${ROOM}`;

const USERS_FIREBASE = new Firebase(`${BASE_URL}/users`);

// Users needed per room
const USERS_PER_ROOM = 3;

// Max time in waiting room
const MAX_WAITING_TIME = 180000; // 3 minutes

// Time a room is open.
const ROOM_OPEN_TIME = 180000; // 3 minutes
const ONE_MIN_WARNING = ROOM_OPEN_TIME - 60000; // 1 minute warning

var currentId = USER_ID;
var currentUser;
var currentRoom;

// Just for reference, not used.
// const USER_STATES = ['waiting', 'room_id', 'done'];

/**
 * CurrentUser is the current user.
 * this.id - user id from Qualtrics
 * this.firebase - connection to Firebase for this user
 * this.isInRoom() - returns true if user is in a chat room
 */
class CurrentUser {
  constructor(id) {
    this.id = id;
    this.firebase = new Firebase(`${BASE_URL}/users/${this.id}`);
    this.pollState();
    this.setWaitingTime();
  }

  isWaiting() { return this.state === 'waiting'; }
  isInRoom() { return this.state !== 'waiting' && this.state !== 'done'; }
  isDone() { return this.state === 'done'; }

  // Grab previous state from Firebase or set as waiting
  // [Minor bug]: When currentUser is set, this doesn't allow user deletion through Firebase
  pollState() {
    this.firebase.on('value', snapshot => {
      this.state = snapshot.val();
      // console.log(this.state);
      if (!this.state) {
        this.firebase.set('waiting');
      } else if (this.isWaiting()) {
        Messaging.sendSystemMessage('Please wait while we match you to a room. If we are not able to ' +
          'match you in 3 minutes you will be able to move on to the next part of the survey.');
      } else if (this.isInRoom()) {
        currentRoom = currentRoom || new Room(this.state);
      } else if (this.isDone()) {
        Messaging.disableMessaging();
      }
    });
  }

  setWaitingTime() {
    setTimeout(() => {
      if (this.state === 'waiting') {
        this.firebase.set('done');
        Messaging.earlyFinish();
      }
    }, MAX_WAITING_TIME);
  }
}

/**
 * AbstractRoom implements polling for user info
 * this.firebase - reference to firebase
 * this.usersFirebase - reference to subfirebase for users
 * this.users - object with user info
 * this.numUsers - number of users
 *
 * this.updateFromUser - abstract method to handle user update
 */
class AbstractRoom {
  constructor(roomType = 'abstract') {
    this.firebase = this.firebase || new Firebase(`${BASE_URL}/${roomType}`);
    // this.users reflects firebase
    this.usersFirebase.on('value', snapshot => { this.users = snapshot.val() || {}; });
    this.pollUsers();
  }

  get numUsers() { return Object.keys(this.users).length; }
  get usersFirebase() { return this.firebase.child('users'); }

  updateFromUser() {
    throw new Error("Can't call abstract method");
  }

  addUser(userId) { this.usersFirebase.update({ [userId]: true }); }
  removeUser(userId) { this.usersFirebase.child(userId).remove(); }

  pollUsers() {
    USERS_FIREBASE.on('child_added', this.updateFromUser.bind(this));
    USERS_FIREBASE.on('child_changed', this.updateFromUser.bind(this));
    USERS_FIREBASE.on('child_removed', snapshot => { this.removeUser(snapshot.key()); });
  }
}

/**
 * WaitingRoom is where users get placed on creation.
 * this.canCreateNewRoom(user_id) - returns true if a new room can be made with the newest user_id
 * this.createNewRoom(newest_user_id) - makes a new Room with 3 users
 */
class WaitingRoom extends AbstractRoom {
  constructor() {
    super('waiting');
  }

  canCreateNewRoom(userId) {
    return this.numUsers === USERS_PER_ROOM - 1 && userId === currentId;
  }

  handleNewUser(id) {
    if (this.canCreateNewRoom(id)) {
      console.log('Creating a new room');
      this.createNewRoom(id);
    } else {
      this.addUser(id);
    }
  }

  updateFromUser(snapshot) {
    const [id, state] = [snapshot.key(), snapshot.val()];
    console.log(`WaitingRoom: User ${id} is ${state}`);

    if (state === 'waiting') {
      this.handleNewUser(id);
    } else {
      this.removeUser(id);
    }
  }

  createNewRoom(newestUserId) {
    currentRoom = new Room();
    const userIds = Object.keys(this.users).slice(-2).concat([newestUserId]);
    userIds.forEach(id => {
      USERS_FIREBASE.child(id).set(currentRoom.id);
    });
  }
}

// Global waiting room
const WAITING_ROOM = new WaitingRoom();

class Messaging {
  static addMessageHTML(name, message) {
    const row = $("<div class='row'>").appendTo(MESSAGES_ELEMENT);
    $("<div class='user'>").text(name).appendTo(row);
    $("<div class='message'>").text(message).appendTo(row);

    // Scroll to bottom of messages
    MESSAGES_ELEMENT[0].scrollTop = MESSAGES_ELEMENT[0].scrollHeight;
  }

  static sendSystemMessage(message) {
    this.addMessageHTML('System', message);
  }

  static enableMessaging() {
    MESSAGE_INPUT.prop('disabled', false);
    this.sendSystemMessage('You have been matched to 2 other participants. You have 3 minutes to chat.');
  }

  static disableMessaging() {
    MESSAGE_INPUT.prop('disabled', true);
  }

  static finishChat() {
    this.disableMessaging();
    this.sendSystemMessage('Your chat time is over. Please proceed to the next section of ' +
                           'the survey using the password "complete123" (without quotes)');
  }

  static earlyFinish() {
    this.disableMessaging();
    this.sendSystemMessage('We were not able to match you with other participants in time. ' +
      'Please proceed to the next section of the survey using the password "alternate123" (without quotes)');
  }
}

/**
 * Room allows 3 people to chat for ROOM_OPEN_TIME seconds
 * Polls messages and adds html when a new message is sent
 */
class Room extends AbstractRoom {
  constructor(id = undefined) {
    super();
    if (id) {
      this.firebase = new Firebase(`${BASE_URL}/rooms/${id}`);
    } else {
      this.firebase = new Firebase(`${BASE_URL}/rooms`).push();
    }

    // this.createdAt is creation time
    this.setCreatedAtAndStartTimers();

    this.messagesFirebase = new Firebase(`${BASE_URL}/messages/${this.id}`);
    Messaging.enableMessaging();
    this.pollMessages();
  }

  get id() { return this.firebase.key(); }

  get timeOpen() { return Date.now() - this.createdAt; }
  get willBeWarned() { return this.timeOpen < ONE_MIN_WARNING; }
  get willBeClosed() { return this.timeOpen < ROOM_OPEN_TIME; }

  setCreatedAtAndStartTimers() {
    let timersStarted = false;

    const createdAtFB = this.firebase.child('createdAt');
    createdAtFB.on('value', (snapshot) => {
      this.createdAt = snapshot.val();
      if (!this.createdAt)     { createdAtFB.set(Firebase.ServerValue.TIMESTAMP); }
      else if (!timersStarted) { timersStarted = true; this.startTimers(); }
    });
  }

  startTimers() {
    const timeToWarning = ONE_MIN_WARNING - this.timeOpen;
    const timeToClose = ROOM_OPEN_TIME - this.timeOpen;
    if (this.willBeWarned) {
      setTimeout(() => Messaging.sendSystemMessage('You have 1 minute remaining.'), timeToWarning);
      setTimeout(Messaging.finishChat.bind(Messaging), timeToClose);
    } else if (this.willBeClosed) {
      setTimeout(Messaging.finishChat.bind(Messaging), timeToClose);
    } else {
      Messaging.finishChat();
    }
  }

  updateFromUser(snapshot) {
    const [id, state] = [snapshot.key(), snapshot.val()];
    console.log(`Room: User ${id} is ${state}`);

    if (state === this.id) { this.addUser(id); }
    else                   { this.removeUser(id); }
  }

  sendMessage(userId, message) {
    this.messagesFirebase.push({ userId, message, created_at: Firebase.ServerValue.TIMESTAMP });
  }

  // Listen for messages and update HTML accordingly
  pollMessages() {
    this.messagesFirebase.limitToLast(10).on('child_added', snapshot => {
      const data = snapshot.val();
      const [userId, message] = [data.userId, data.message];
      Messaging.addMessageHTML(userId, message);
    });
  }
}

// Dom elements
const MESSAGE_INPUT = $('#messageInput');
const USER_ID_INPUT = $('#userId');
const MESSAGES_ELEMENT = $('#messages');

// Id entered should => new User
currentUser = new CurrentUser(currentId);
USER_ID_INPUT.val(currentId);
USER_ID_INPUT.prop('disabled', true);

// Send message when entered
MESSAGE_INPUT.keypress((e) => {
  if (e.keyCode === 13) {
    const message = MESSAGE_INPUT.val();
    currentRoom.sendMessage(currentId, message);

    // Blank input
    MESSAGE_INPUT.val('');
  }
});

/*eslint-enable */