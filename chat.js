"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

(function () {
  // Base Firebase URL
  var BASE_URL = "https://research-chat-room.firebaseio.com";

  var USERS_FIREBASE = new Firebase("" + BASE_URL + "/users");

  // Users needed per room
  var USERS_PER_ROOM = 3;

  // Time a room is open.
  var ROOM_OPEN_TIME = 600000; // 10 minutes
  var FIVE_MIN_WARNING = 300000; // 5 minute warning
  var ONE_MIN_WARNING = 540000; // 1 minute warning

  var currentId;
  var currentUser;
  var currentRoom;

  // Just for reference, not used.
  var USER_STATES = ["waiting", "room_id", "done"];

  /**
   * CurrentUser is the current user.
   * this.id - user id from Qualtrics
   * this.firebase - connection to Firebase for this user
   * this.isInRoom() - returns true if user is in a chat room
   */

  var CurrentUser = (function () {
    function CurrentUser(id) {
      _classCallCheck(this, CurrentUser);

      this.id = id;
      this.firebase = new Firebase("" + BASE_URL + "/users/" + this.id);
      this.pollState();
    }

    _createClass(CurrentUser, {
      isInRoom: {
        value: function isInRoom() {
          return this.state !== "waiting" && this.state !== "done";
        }
      },
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
            } else if (_this.isInRoom()) {
              currentRoom = currentRoom || new Room(_this.state);
            }
          });
        }
      }
    });

    return CurrentUser;
  })();

  /**
   * AbstractRoom implements polling for user info
   * this.firebase - reference to firebase
   * this.usersFirebase - reference to subfirebase for users
   * this.users - object with user info
   * this.numUsers - number of users
   *
   * this.updateFromUser - abstract method to handle user update
   */

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

  /**
   * WaitingRoom is where users get placed on creation.
   * this.canCreateNewRoom(user_id) - returns true if a new room can be made with the newest user_id
   * this.createNewRoom(newest_user_id) - makes a new Room with 3 users
   */

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

  /**
   * Room allows 3 people to chat for ROOM_OPEN_TIME seconds
   * Polls messages and adds html when a new message is sent
   */

  var Room = (function (_AbstractRoom2) {
    function Room() {
      var id = arguments[0] === undefined ? undefined : arguments[0];

      _classCallCheck(this, Room);

      if (id) {
        this.firebase = new Firebase("" + BASE_URL + "/rooms/" + id);
      } else {
        this.firebase = new Firebase("" + BASE_URL + "/rooms").push();
      }
      _get(Object.getPrototypeOf(Room.prototype), "constructor", this).call(this);
      // this.createdAt is creation time
      this.setCreatedAt();
      this.startTimers();

      this.messagesFirebase = new Firebase("" + BASE_URL + "/messages/" + this.id);
      this.enableMessaging();
      this.pollMessages();
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
              createdAtFB.set(Firebase.ServerValue.TIMESTAMP);
            }
          });
        }
      },
      startTimers: {
        value: function startTimers() {
          var _this = this;

          setTimeout(function () {
            return _this.sendSystemMessage("You have 5 minutes remaining.");
          }, FIVE_MIN_WARNING);
          setTimeout(function () {
            return _this.sendSystemMessage("You have 1 minute remaining.");
          }, ONE_MIN_WARNING);
          setTimeout(this.disableMessaging.bind(this), ROOM_OPEN_TIME);
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
      },
      sendSystemMessage: {
        value: function sendSystemMessage(message) {
          this.addMessageHTML("System", message);
        }
      },
      addMessageHTML: {
        value: function addMessageHTML(name, message) {
          var row = $("<div class='row'>").appendTo(MESSAGES_ELEMENT);
          $("<div class='user'>").text(name).appendTo(row);
          $("<div class='message'>").text(message).appendTo(row);

          // Scroll to bottom of messages
          MESSAGES_ELEMENT[0].scrollTop = MESSAGES_ELEMENT[0].scrollHeight;
        }
      },
      enableMessaging: {

        // Enable message input

        value: function enableMessaging() {
          MESSAGE_INPUT.prop("disabled", false);
          this.sendSystemMessage("You have been matched to 2 other participants. You have 10 minutes to chat.");
        }
      },
      disableMessaging: {

        // Disables message input

        value: function disableMessaging() {
          MESSAGE_INPUT.prop("disabled", true);
          this.sendSystemMessage("Your chat time is over. Please proceed to the next section of the survey.");
        }
      },
      pollMessages: {

        // Listen for messages and update HTML accordingly

        value: function pollMessages() {
          var _this = this;

          this.messagesFirebase.limitToLast(10).on("child_added", function (snapshot) {
            var data = snapshot.val();
            var userId = data.user_id;
            var message = data.message;

            _this.addMessageHTML(userId, message);
          });
        }
      }
    });

    return Room;
  })(AbstractRoom);

  // Dom elements
  var MESSAGE_INPUT = $("#messageInput");
  var USER_ID_INPUT = $("#userId");
  var MESSAGES_ELEMENT = $("#messages");

  // Id entered should => new User
  USER_ID_INPUT.keypress(function (e) {
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
