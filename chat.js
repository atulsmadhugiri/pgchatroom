"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// Base Firebase URL
var BASE_URL = "https://research-chat-room.firebaseio.com";

var WaitingRoom = function WaitingRoom() {
  var _this = this;

  _classCallCheck(this, WaitingRoom);

  this.firebase = new Firebase("" + BASE_URL + "/waiting");
  this.firebase.on("value", function (snapshot) {
    _this.users = snapshot.val();
  });
};

var WAITING_ROOM = new WaitingRoom();

var CurrentUser = (function () {
  function CurrentUser(id) {
    _classCallCheck(this, CurrentUser);

    this.id = id;
    this.firebase = new Firebase("" + BASE_URL + "/users/" + this.id);
    this.pullInfoAndSetState();
  }

  _createClass(CurrentUser, {
    pullInfoAndSetState: {

      // Grab previous info from Firebase or create a new user

      value: function pullInfoAndSetState() {
        var _this = this;

        this.firebase.once("value", function (snapshot) {
          _this.state = snapshot.val();
          // If new user, initialize everything properly
          if (!snapshot.val()) {
            _this.state = "waiting";
            _this.addToWaiting();
          }
        });
      }
    },
    addToWaiting: {

      // Adds a new user to waiting room and creates a new chat room if possible

      value: function addToWaiting() {
        this.firebase.set("waiting");
        var waiting = new Firebase("" + BASE_URL + "/waiting");
        waiting.update(_defineProperty({}, this.id, true));
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

var currentUser;
USER_ID.keypress(function (e) {
  var user_id = USER_ID.val();
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
