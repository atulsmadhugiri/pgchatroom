"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

(function () {
  // Grab room from URL
  var URL_REGEX = /room=(\w+)/;
  var PARAMS = URL_REGEX.exec(location.search);
  if (!PARAMS) {
    throw "Missing room in URL!";
  }
  var ROOM = PARAMS[1];
  if ($.inArray(ROOM, ["worker", "manager"]) < 0) {
    throw "Bad room in URL!";
  }

  // Base Firebase URL
  var BASE_URL = "https://research-chat-room.firebaseio.com/" + ROOM;

  var USERS_FIREBASE = new Firebase("" + BASE_URL + "/users");

  // Users needed per room
  var USERS_PER_ROOM = 3;

  // Max time in waiting room
  var MAX_WAITING_TIME = 180000; // 3 minutes

  // Time a room is open.
  var ROOM_OPEN_TIME = 300000; // 5 minutes
  var ONE_MIN_WARNING = 240000; // 1 minute warning

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
      this.setWaitingTime();
    }

    _createClass(CurrentUser, {
      isWaiting: {
        value: function isWaiting() {
          return this.state === "waiting";
        }
      },
      isInRoom: {
        value: function isInRoom() {
          return this.state !== "waiting" && this.state !== "done";
        }
      },
      isDone: {
        value: function isDone() {
          return this.state === "done";
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
            } else if (_this.isWaiting()) {
              Messaging.sendSystemMessage("Please wait while we match you to a room. If we are not able to " + "match you in 3 minutes you will be able to move on to the next part of the survey.");
            } else if (_this.isInRoom()) {
              currentRoom = currentRoom || new Room(_this.state);
            } else if (_this.isDone()) {
              Messaging.disableMessaging();
            }
          });
        }
      },
      setWaitingTime: {
        value: function setWaitingTime() {
          var _this = this;

          setTimeout(function () {
            if (_this.state === "waiting") {
              _this.firebase.set("done");
              Messaging.earlyFinish();
            }
          }, MAX_WAITING_TIME);
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

  var Messaging = (function () {
    function Messaging() {
      _classCallCheck(this, Messaging);
    }

    _createClass(Messaging, null, {
      addMessageHTML: {
        value: function addMessageHTML(name, message) {
          var row = $("<div class='row'>").appendTo(MESSAGES_ELEMENT);
          $("<div class='user'>").text(name).appendTo(row);
          $("<div class='message'>").text(message).appendTo(row);

          // Scroll to bottom of messages
          MESSAGES_ELEMENT[0].scrollTop = MESSAGES_ELEMENT[0].scrollHeight;
        }
      },
      sendSystemMessage: {
        value: function sendSystemMessage(message) {
          this.addMessageHTML("System", message);
        }
      },
      enableMessaging: {
        value: function enableMessaging() {
          MESSAGE_INPUT.prop("disabled", false);
          this.sendSystemMessage("You have been matched to 2 other participants. You have 5 minutes to chat.");
        }
      },
      disableMessaging: {
        value: function disableMessaging() {
          MESSAGE_INPUT.prop("disabled", true);
          this.sendSystemMessage("Your chat time is over. Please proceed to the next section of " + "the survey using the password complete123");
        }
      },
      earlyFinish: {
        value: function earlyFinish() {
          MESSAGE_INPUT.prop("disabled", true);
          this.sendSystemMessage("We were not able to match you with other participants in time. " + "Please proceed to the next section of the survey using the password alternate123");
        }
      }
    });

    return Messaging;
  })();

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
      this.setCreatedAtAndStartTimers();

      this.messagesFirebase = new Firebase("" + BASE_URL + "/messages/" + this.id);
      Messaging.enableMessaging();
      this.pollMessages();
    }

    _inherits(Room, _AbstractRoom2);

    _createClass(Room, {
      id: {
        get: function () {
          return this.firebase.key();
        }
      },
      timeOpen: {
        get: function () {
          return Date.now() - this.createdAt;
        }
      },
      willBeWarned: {
        get: function () {
          return this.timeOpen < ONE_MIN_WARNING;
        }
      },
      willBeClosed: {
        get: function () {
          return this.timeOpen < ROOM_OPEN_TIME;
        }
      },
      setCreatedAtAndStartTimers: {
        value: function setCreatedAtAndStartTimers() {
          var _this = this;

          var createdAtFB = this.firebase.child("createdAt");
          createdAtFB.on("value", function (snapshot) {
            _this.createdAt = snapshot.val();
            if (!_this.createdAt) {
              createdAtFB.set(Firebase.ServerValue.TIMESTAMP);
            } else {
              _this.startTimers();
            }
          });
        }
      },
      startTimers: {
        value: function startTimers() {
          var timeToWarning = ONE_MIN_WARNING - this.timeOpen;
          var timeToClose = ROOM_OPEN_TIME - this.timeOpen;
          if (this.willBeWarned) {
            setTimeout(function () {
              return Messaging.sendSystemMessage("You have 1 minute remaining.");
            }, timeToWarning);
            setTimeout(Messaging.disableMessaging.bind(Messaging), timeToClose);
          } else if (this.willBeClosed) {
            setTimeout(Messaging.disableMessaging.bind(Messaging), timeToClose);
          } else {
            Messaging.disableMessaging();
          }
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
          this.messagesFirebase.push({ user_id: user_id, message: message, created_at: Firebase.ServerValue.TIMESTAMP });
        }
      },
      pollMessages: {

        // Listen for messages and update HTML accordingly

        value: function pollMessages() {
          this.messagesFirebase.limitToLast(10).on("child_added", function (snapshot) {
            var data = snapshot.val();
            var userId = data.user_id;
            var message = data.message;

            Messaging.addMessageHTML(userId, message);
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
      USER_ID_INPUT.prop("disabled", true);
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
