(() => {
  // Grab room from URL
  const URL_REGEX = /room=(\w+)/;
  const PARAMS = URL_REGEX.exec(location.search)
  if (!PARAMS) { throw "Missing room in URL!"; }
  const ROOM = PARAMS[1];
  if ($.inArray(ROOM, ["worker", "manager"]) < 0) { throw "Bad room in URL!"; }

  // Base Firebase URL
  const BASE_URL = `https://research-chat-room.firebaseio.com/${ROOM}`;

  const USERS_FIREBASE = new Firebase(`${BASE_URL}/users`);

  // Users needed per room
  const USERS_PER_ROOM = 3;

  // Max time in waiting room
  const MAX_WAITING_TIME = 180000 // 3 minutes

  // Time a room is open.
  const ROOM_OPEN_TIME = 300000 // 5 minutes
  const ONE_MIN_WARNING = 240000 // 1 minute warning

  var currentId;
  var currentUser;
  var currentRoom;

  // Just for reference, not used.
  const USER_STATES = ["waiting", "room_id", "done"];

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

    isWaiting() { return this.state === "waiting"; }
    isInRoom() { return this.state !== "waiting" && this.state !== "done"; }
    isDone() { return this.state === "done"; }

    // Grab previous state from Firebase or set as waiting
    // [Minor bug]: When currentUser is set, this doesn't allow user deletion through Firebase
    pollState() {
      this.firebase.on("value", snapshot => {
        this.state = snapshot.val();
        // console.log(this.state);
        if (!this.state) {
          this.firebase.set("waiting");
        } else if (this.isWaiting()) {
          Messaging.sendSystemMessage("Please wait while we match you to a room. If we are not able to " +
            "match you in 3 minutes you will be able to move on to the next part of the survey.");
        } else if (this.isInRoom()) {
          currentRoom = currentRoom || new Room(this.state);
        } else if (this.isDone()) {
          Messaging.disableMessaging();
        }
      });
    }

    setWaitingTime() {
      setTimeout(() => {
        if (this.state === "waiting") {
          this.firebase.set("done");
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

  /**
   * WaitingRoom is where users get placed on creation.
   * this.canCreateNewRoom(user_id) - returns true if a new room can be made with the newest user_id
   * this.createNewRoom(newest_user_id) - makes a new Room with 3 users
   */
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

  class Messaging {
    static addMessageHTML(name, message) {
      var row = $("<div class='row'>").appendTo(MESSAGES_ELEMENT);
      $("<div class='user'>").text(name).appendTo(row);
      $("<div class='message'>").text(message).appendTo(row);

      // Scroll to bottom of messages
      MESSAGES_ELEMENT[0].scrollTop = MESSAGES_ELEMENT[0].scrollHeight;
    }

    static sendSystemMessage(message) {
      this.addMessageHTML("System", message);
    }

    static enableMessaging() {
      MESSAGE_INPUT.prop("disabled", false);
      this.sendSystemMessage("You have been matched to 2 other participants. You have 10 minutes to chat.");
    }

    static disableMessaging() {
      MESSAGE_INPUT.prop("disabled", true);
      this.sendSystemMessage("Your chat time is over. Please proceed to the next section of " +
                             "the survey using the password complete123.");
    }

    static earlyFinish() {
      MESSAGE_INPUT.prop("disabled", true);
      this.sendSystemMessage("We were not able to match you with other participants in time. " +
        "Please proceed to the next section of the survey using the password alternate123.");
    }
  }

  /**
   * Room allows 3 people to chat for ROOM_OPEN_TIME seconds
   * Polls messages and adds html when a new message is sent
   */
  class Room extends AbstractRoom {
    constructor(id = undefined) {
      if (id) {
        this.firebase = new Firebase(`${BASE_URL}/rooms/${id}`);
      } else {
        this.firebase = new Firebase(`${BASE_URL}/rooms`).push();
      }
      super();
      // this.createdAt is creation time
      this.setCreatedAtAndStartTimers();

      this.messagesFirebase = new Firebase(`${BASE_URL}/messages/${this.id}`)
      Messaging.enableMessaging();
      this.pollMessages();
    }

    get id() { return this.firebase.key(); }

    get timeOpen() { return Date.now() - this.createdAt; }
    get willBeWarned() { return this.timeOpen < ONE_MIN_WARNING; }
    get willBeClosed() { return this.timeOpen < ROOM_OPEN_TIME; }

    setCreatedAtAndStartTimers() {
      var createdAtFB = this.firebase.child("createdAt");
      createdAtFB.on("value", (snapshot) => {
        this.createdAt = snapshot.val();
        if (!this.createdAt) { createdAtFB.set(Firebase.ServerValue.TIMESTAMP); }
        else                 { this.startTimers() }
      });
    }

    startTimers() {
      const timeToWarning = ONE_MIN_WARNING - this.timeOpen;
      const timeToClose = ROOM_OPEN_TIME - this.timeOpen;
      if (this.willBeWarned) {
        setTimeout(() => Messaging.sendSystemMessage("You have 1 minute remaining."), timeToWarning);
        setTimeout(Messaging.disableMessaging.bind(Messaging), timeToClose);
      } else if (this.willBeClosed) {
        setTimeout(Messaging.disableMessaging.bind(Messaging), timeToClose);
      } else {
        Messaging.disableMessaging();
      }
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

    // Listen for messages and update HTML accordingly
    pollMessages() {
      this.messagesFirebase.limitToLast(10).on("child_added", snapshot => {
        var data = snapshot.val();
        var [userId, message] = [data.user_id, data.message];
        Messaging.addMessageHTML(userId, message);
      });
    }
  }

  // Dom elements
  const MESSAGE_INPUT = $("#messageInput");
  const USER_ID_INPUT = $("#userId");
  const MESSAGES_ELEMENT = $("#messages");

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
})();
