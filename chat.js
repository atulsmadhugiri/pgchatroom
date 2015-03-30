"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// Base Firebase URL
var BASE_URL = "https://research-chat-room.firebaseio.com";

var currentId;
var currentUser;

var AbstractRoom = (function () {
  function AbstractRoom(_ref) {
    var _this = this;

    var type = _ref.room_type;

    _classCallCheck(this, AbstractRoom);

    this.firebase = new Firebase("" + BASE_URL + "/" + type);;
    // this.users reflects firebase
    this.firebase.on("value", function (snapshot) {
      _this.users = snapshot.val() || {};
    });
    this.userFirebase = new Firebase("" + BASE_URL + "/users");;
    this.pollUsers();
  }

  _createClass(AbstractRoom, {
    numUsers: {
      get: function () {
        return Object.keys(this.users).length;
      }
    },
    updateFromUsers: {
      value: function updateFromUsers(snapshot) {
        throw new Error("Can't call abstract method");
      }
    },
    removeUser: {
      value: function removeUser(user_id) {
        this.firebase.child(user_id).remove();
      }
    },
    pollUsers: {
      value: function pollUsers() {
        var _this = this;

        this.userFirebase.on("child_added", this.updateFromUsers.bind(this));
        this.userFirebase.on("child_changed", this.updateFromUsers.bind(this));
        this.userFirebase.on("child_removed", function (snapshot) {
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

    _get(Object.getPrototypeOf(WaitingRoom.prototype), "constructor", this).call(this, { room_type: "waiting" });
  }

  _inherits(WaitingRoom, _AbstractRoom);

  _createClass(WaitingRoom, {
    updateFromUsers: {
      value: function updateFromUsers(snapshot) {
        var id = snapshot.key();
        var state = snapshot.val();

        console.log("User " + id + " is " + state);

        if (state === "waiting") {
          if (this.numUsers === 2 && id === currentId) console.log("Make a new room");
          this.firebase.update(_defineProperty({}, id, true));
        } else {
          this.removeUser(id);
        }
      }
    }
  });

  return WaitingRoom;
})(AbstractRoom);

// Global waiting room
var WAITING_ROOM = new WaitingRoom();

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

var Room = (function () {
  function Room() {
    _classCallCheck(this, Room);

    this.firebase = new Firebase("" + BASE_URL + "/rooms").push();
    this.id = this.firebase.key();
    this.firebase.update({ createdAt: Firebase.ServerValue.TIMESTAMP });
    this.pollUsers();
  }

  _createClass(Room, {
    pollUsers: {
      value: function pollUsers() {}
    }
  });

  return Room;
})();

// REGISTER DOM ELEMENTS
var MESSAGE_INPUT = $("#messageInput");
var USER_ID = $("#userId");
var MESSAGE_LIST = $("#messages");

USER_ID.keypress(function (e) {
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
