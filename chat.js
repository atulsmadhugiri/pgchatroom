"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// Base Firebase URL
var BASE_URL = "https://research-chat-room.firebaseio.com";

var USERS_FIREBASE = new Firebase("" + BASE_URL + "/users");

// Users needed per room
var USERS_PER_ROOM = 3;

// Time a room is open.
var ROOM_OPEN_TIME = 600000; // 10 minutes

var currentId;
var currentUser;
var currentRoom;

// Just for reference, not used.
var USER_STATES = ["waiting", "room_id", "done"];

var CurrentUser = (function () {
  function CurrentUser(id) {
    _classCallCheck(this, CurrentUser);

    this.id = id;
    this.firebase = new Firebase("" + BASE_URL + "/users/" + this.id);
    this.pollState();
  }

  _createClass(CurrentUser, {
    pollState: {

      // Grab previous state from Firebase or set as waiting
      // [Minor bug]: When currentUser is set, this doesn't allow user deletion through Firebase

      value: function pollState() {
        var _this = this;

        this.firebase.on("value", function (snapshot) {
          _this.state = snapshot.val();
          // console.log(this.state);
          if (!_this.state) {
            _this.firebase.set("waiting");
          }
        });
      }
    }
  });

  return CurrentUser;
})();

var AbstractRoom = (function () {
  function AbstractRoom() {
    var _this = this;

    var room_type = arguments[0] === undefined ? "abstract" : arguments[0];

    _classCallCheck(this, AbstractRoom);

    this.firebase = this.firebase || new Firebase("" + BASE_URL + "/" + room_type);;
    // this.users reflects firebase
    this.usersFirebase.on("value", function (snapshot) {
      _this.users = snapshot.val() || {};
    });
    this.pollUsers();
  }

  _createClass(AbstractRoom, {
    numUsers: {
      get: function () {
        return Object.keys(this.users).length;
      }
    },
    usersFirebase: {
      get: function () {
        return this.firebase.child("users");
      }
    },
    updateFromUser: {
      value: function updateFromUser(snapshot) {
        throw new Error("Can't call abstract method");
      }
    },
    addUser: {
      value: function addUser(user_id) {
        this.usersFirebase.update(_defineProperty({}, user_id, true));
      }
    },
    removeUser: {
      value: function removeUser(user_id) {
        this.usersFirebase.child(user_id).remove();
      }
    },
    pollUsers: {
      value: function pollUsers() {
        var _this = this;

        USERS_FIREBASE.on("child_added", this.updateFromUser.bind(this));
        USERS_FIREBASE.on("child_changed", this.updateFromUser.bind(this));
        USERS_FIREBASE.on("child_removed", function (snapshot) {
          _this.removeUser(snapshot.key());
        });
      }
    }
  });

  return AbstractRoom;
})();

var WaitingRoom = (function (_AbstractRoom) {
  function WaitingRoom() {
    _classCallCheck(this, WaitingRoom);

    _get(Object.getPrototypeOf(WaitingRoom.prototype), "constructor", this).call(this, "waiting");
  }

  _inherits(WaitingRoom, _AbstractRoom);

  _createClass(WaitingRoom, {
    canCreateNewRoom: {
      value: function canCreateNewRoom(user_id) {
        return this.numUsers === USERS_PER_ROOM - 1 && user_id === currentId;
      }
    },
    handleNewUser: {
      value: function handleNewUser(id) {
        if (this.canCreateNewRoom(id)) {
          console.log("Creating a new room");
          this.createNewRoom(id);
        } else {
          this.addUser(id);
        }
      }
    },
    updateFromUser: {
      value: function updateFromUser(snapshot) {
        var id = snapshot.key();
        var state = snapshot.val();

        console.log("WaitingRoom: User " + id + " is " + state);

        if (state === "waiting") {
          this.handleNewUser(id);
        } else {
          this.removeUser(id);
        }
      }
    },
    createNewRoom: {
      value: function createNewRoom(newest_user_id) {
        currentRoom = new Room();
        var user_ids = Object.keys(this.users).slice(-2).concat([newest_user_id]);
        user_ids.forEach(function (id) {
          USERS_FIREBASE.child(id).set(currentRoom.id);
        });
      }
    }
  });

  return WaitingRoom;
})(AbstractRoom);

// Global waiting room
var WAITING_ROOM = new WaitingRoom();

var Room = (function (_AbstractRoom2) {
  function Room() {
    var id = arguments[0] === undefined ? undefined : arguments[0];

    _classCallCheck(this, Room);

    if (id) {
      this.firebase = new Firebase("" + BASE_URL + "/rooms/" + id);
    } else {
      this.firebase = new Firebase("" + BASE_URL + "/rooms").push();
    }
    // this.createdAt is creation time
    this.setCreatedAt();
    this.messagesFirebase = new Firebase("" + BASE_URL + "/messages/" + this.id);
    _get(Object.getPrototypeOf(Room.prototype), "constructor", this).call(this);
  }

  _inherits(Room, _AbstractRoom2);

  _createClass(Room, {
    id: {
      get: function () {
        return this.firebase.key();
      }
    },
    isOpen: {
      value: function isOpen() {
        return Firebase.ServerValue.TIMESTAMP - this.createdAt > ROOM_OPEN_TIME;
      }
    },
    setCreatedAt: {
      value: function setCreatedAt() {
        var _this = this;

        var createdAtFB = this.firebase.child("createdAt");
        createdAtFB.on("value", function (snapshot) {
          _this.createdAt = snapshot.val();
          if (!_this.createdAt) {
            createdAtFB.set({ createdAt: Firebase.ServerValue.TIMESTAMP });
          }
        });
      }
    },
    updateFromUser: {
      value: function updateFromUser(snapshot) {
        var id = snapshot.key();
        var state = snapshot.val();

        console.log("Room: User " + id + " is " + state);

        if (state === this.id) {
          this.addUser(id);
        } else {
          this.removeUser(id);
        }
      }
    },
    sendMessage: {
      value: function sendMessage(user_id, message) {
        this.messagesFirebase.push({ user_id: user_id, message: message });
      }
    }
  });

  return Room;
})(AbstractRoom);

// Dom elements
var MESSAGE_INPUT = $("#messageInput");
var USER_ID = $("#userId");
var MESSAGE_LIST = $("#messages");

// Id entered should => new User
USER_ID.keypress(function (e) {
  currentId = USER_ID.val();
  if (e.keyCode === 13 && currentId) {
    currentUser = new CurrentUser(currentId);
  }
});

// When message is entered
MESSAGE_INPUT.keypress(function (e) {
  if (e.keyCode == 13) {
    //FIELD VALUES
    var username = USER_ID.val();
    var message = MESSAGE_INPUT.val();

    //SAVE DATA TO FIREBASE AND EMPTY FIELD
    FIREBASE.push({ name: username, text: message });
    MESSAGE_INPUT.val("");
  }
});

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
