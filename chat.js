"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// Base Firebase URL
var BASE_URL = "https://research-chat-room.firebaseio.com";

var currentId;
var currentUser;

var WaitingRoom = (function () {
  function WaitingRoom() {
    var _this = this;

    _classCallCheck(this, WaitingRoom);

    this.firebase = new Firebase("" + BASE_URL + "/waiting");
    // this.users reflects firebase
    this.firebase.on("value", function (snapshot) {
      _this.users = snapshot.val() || {};
    });
    this.userFirebase = new Firebase("" + BASE_URL + "/users");
    this.pollUsers();
  }

  _createClass(WaitingRoom, {
    numUsers: {
      get: function () {
        return Object.keys(this.users).length;
      }
    },
    pollUsers: {
      value: function pollUsers() {
        var _this = this;

        var updateFromUsers = function (snapshot) {
          var id = snapshot.key();
          var state = snapshot.val();

          console.log("" + id + " is " + state);

          if (state === "waiting") {
            if (_this.numUsers === 2 && id === currentId) console.log("Make a new room");
            _this.firebase.update(_defineProperty({}, id, true));
          } else {
            _this.firebase.child(id).remove();
          }
        };
        var removeFromUsers = function (snapshot) {
          _this.firebase.child(snapshot.key()).remove();
        };
        this.userFirebase.on("child_added", updateFromUsers);
        this.userFirebase.on("child_changed", updateFromUsers);
        this.userFirebase.on("child_removed", removeFromUsers);
      }
    }
  });

  return WaitingRoom;
})();

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
          console.log(_this.state);
          if (!_this.state) {
            _this.firebase.set("waiting");
          }
        });
      }
    }
  });

  return CurrentUser;
})();

var Room = function Room() {
  _classCallCheck(this, Room);
};

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
