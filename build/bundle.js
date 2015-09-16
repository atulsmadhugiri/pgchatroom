/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*eslint-disable */
	'use strict';

	var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	__webpack_require__(2);

	// Grab room from URL
	var URL_REGEX = /room=(\w+)/;
	var ROOM_PARAMS = URL_REGEX.exec(location.search);
	if (!ROOM_PARAMS) {
	  throw new Error('Missing room in URL!');
	}
	var ROOM = ROOM_PARAMS[1];

	// Grab user_id from URL
	var USER_ID_REGEX = /user_id=(\w+)/;
	var USER_ID_PARAMS = USER_ID_REGEX.exec(location.search);
	if (!USER_ID_PARAMS) {
	  throw new Error('Missing user_id in URL!');
	}
	var USER_ID = USER_ID_PARAMS[1];

	// Base Firebase URL
	var BASE_URL = 'https://research-chat-room.firebaseio.com/' + ROOM;

	var USERS_FIREBASE = new Firebase(BASE_URL + '/users');

	// Users needed per room
	var USERS_PER_ROOM = 3;

	// Max time in waiting room
	var MAX_WAITING_TIME = 180000; // 3 minutes

	// Time a room is open.
	var ROOM_OPEN_TIME = 180000; // 3 minutes
	var ONE_MIN_WARNING = ROOM_OPEN_TIME - 60000; // 1 minute warning

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

	var CurrentUser = (function () {
	  function CurrentUser(id) {
	    _classCallCheck(this, CurrentUser);

	    this.id = id;
	    this.firebase = new Firebase(BASE_URL + '/users/' + this.id);
	    this.pollState();
	    this.setWaitingTime();
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

	  _createClass(CurrentUser, [{
	    key: 'isWaiting',
	    value: function isWaiting() {
	      return this.state === 'waiting';
	    }
	  }, {
	    key: 'isInRoom',
	    value: function isInRoom() {
	      return this.state !== 'waiting' && this.state !== 'done';
	    }
	  }, {
	    key: 'isDone',
	    value: function isDone() {
	      return this.state === 'done';
	    }

	    // Grab previous state from Firebase or set as waiting
	    // [Minor bug]: When currentUser is set, this doesn't allow user deletion through Firebase
	  }, {
	    key: 'pollState',
	    value: function pollState() {
	      var _this = this;

	      this.firebase.on('value', function (snapshot) {
	        _this.state = snapshot.val();
	        // console.log(this.state);
	        if (!_this.state) {
	          _this.firebase.set('waiting');
	        } else if (_this.isWaiting()) {
	          Messaging.sendSystemMessage('Please wait while we match you to a room. If we are not able to ' + 'match you in 3 minutes you will be able to move on to the next part of the survey.');
	        } else if (_this.isInRoom()) {
	          currentRoom = currentRoom || new Room(_this.state);
	        } else if (_this.isDone()) {
	          Messaging.disableMessaging();
	        }
	      });
	    }
	  }, {
	    key: 'setWaitingTime',
	    value: function setWaitingTime() {
	      var _this2 = this;

	      setTimeout(function () {
	        if (_this2.state === 'waiting') {
	          _this2.firebase.set('done');
	          Messaging.earlyFinish();
	        }
	      }, MAX_WAITING_TIME);
	    }
	  }]);

	  return CurrentUser;
	})();

	var AbstractRoom = (function () {
	  function AbstractRoom() {
	    var _this3 = this;

	    var roomType = arguments.length <= 0 || arguments[0] === undefined ? 'abstract' : arguments[0];

	    _classCallCheck(this, AbstractRoom);

	    this.firebase = this.firebase || new Firebase(BASE_URL + '/' + roomType);
	    // this.users reflects firebase
	    this.usersFirebase.on('value', function (snapshot) {
	      _this3.users = snapshot.val() || {};
	    });
	    this.pollUsers();
	  }

	  /**
	   * WaitingRoom is where users get placed on creation.
	   * this.canCreateNewRoom(user_id) - returns true if a new room can be made with the newest user_id
	   * this.createNewRoom(newest_user_id) - makes a new Room with 3 users
	   */

	  _createClass(AbstractRoom, [{
	    key: 'updateFromUser',
	    value: function updateFromUser() {
	      throw new Error("Can't call abstract method");
	    }
	  }, {
	    key: 'addUser',
	    value: function addUser(userId) {
	      this.usersFirebase.update(_defineProperty({}, userId, true));
	    }
	  }, {
	    key: 'removeUser',
	    value: function removeUser(userId) {
	      this.usersFirebase.child(userId).remove();
	    }
	  }, {
	    key: 'pollUsers',
	    value: function pollUsers() {
	      var _this4 = this;

	      USERS_FIREBASE.on('child_added', this.updateFromUser.bind(this));
	      USERS_FIREBASE.on('child_changed', this.updateFromUser.bind(this));
	      USERS_FIREBASE.on('child_removed', function (snapshot) {
	        _this4.removeUser(snapshot.key());
	      });
	    }
	  }, {
	    key: 'numUsers',
	    get: function get() {
	      return Object.keys(this.users).length;
	    }
	  }, {
	    key: 'usersFirebase',
	    get: function get() {
	      return this.firebase.child('users');
	    }
	  }]);

	  return AbstractRoom;
	})();

	var WaitingRoom = (function (_AbstractRoom) {
	  _inherits(WaitingRoom, _AbstractRoom);

	  function WaitingRoom() {
	    _classCallCheck(this, WaitingRoom);

	    _get(Object.getPrototypeOf(WaitingRoom.prototype), 'constructor', this).call(this, 'waiting');
	  }

	  // Global waiting room

	  _createClass(WaitingRoom, [{
	    key: 'canCreateNewRoom',
	    value: function canCreateNewRoom(userId) {
	      return this.numUsers === USERS_PER_ROOM - 1 && userId === currentId;
	    }
	  }, {
	    key: 'handleNewUser',
	    value: function handleNewUser(id) {
	      if (this.canCreateNewRoom(id)) {
	        console.log('Creating a new room');
	        this.createNewRoom(id);
	      } else {
	        this.addUser(id);
	      }
	    }
	  }, {
	    key: 'updateFromUser',
	    value: function updateFromUser(snapshot) {
	      var id = snapshot.key();
	      var state = snapshot.val();

	      console.log('WaitingRoom: User ' + id + ' is ' + state);

	      if (state === 'waiting') {
	        this.handleNewUser(id);
	      } else {
	        this.removeUser(id);
	      }
	    }
	  }, {
	    key: 'createNewRoom',
	    value: function createNewRoom(newestUserId) {
	      currentRoom = new Room();
	      var userIds = Object.keys(this.users).slice(-2).concat([newestUserId]);
	      userIds.forEach(function (id) {
	        USERS_FIREBASE.child(id).set(currentRoom.id);
	      });
	    }
	  }]);

	  return WaitingRoom;
	})(AbstractRoom);

	var WAITING_ROOM = new WaitingRoom();

	var Messaging = (function () {
	  function Messaging() {
	    _classCallCheck(this, Messaging);
	  }

	  /**
	   * Room allows 3 people to chat for ROOM_OPEN_TIME seconds
	   * Polls messages and adds html when a new message is sent
	   */

	  _createClass(Messaging, null, [{
	    key: 'addMessageHTML',
	    value: function addMessageHTML(name, message) {
	      var row = $("<div class='row'>").appendTo(MESSAGES_ELEMENT);
	      $("<div class='user'>").text(name).appendTo(row);
	      $("<div class='message'>").text(message).appendTo(row);

	      // Scroll to bottom of messages
	      MESSAGES_ELEMENT[0].scrollTop = MESSAGES_ELEMENT[0].scrollHeight;
	    }
	  }, {
	    key: 'sendSystemMessage',
	    value: function sendSystemMessage(message) {
	      this.addMessageHTML('System', message);
	    }
	  }, {
	    key: 'enableMessaging',
	    value: function enableMessaging() {
	      MESSAGE_INPUT.prop('disabled', false);
	      this.sendSystemMessage('You have been matched to 2 other participants. You have 3 minutes to chat.');
	    }
	  }, {
	    key: 'disableMessaging',
	    value: function disableMessaging() {
	      MESSAGE_INPUT.prop('disabled', true);
	    }
	  }, {
	    key: 'finishChat',
	    value: function finishChat() {
	      this.disableMessaging();
	      this.sendSystemMessage('Your chat time is over. Please proceed to the next section of ' + 'the survey using the password "complete123" (without quotes)');
	    }
	  }, {
	    key: 'earlyFinish',
	    value: function earlyFinish() {
	      this.disableMessaging();
	      this.sendSystemMessage('We were not able to match you with other participants in time. ' + 'Please proceed to the next section of the survey using the password "alternate123" (without quotes)');
	    }
	  }]);

	  return Messaging;
	})();

	var Room = (function (_AbstractRoom2) {
	  _inherits(Room, _AbstractRoom2);

	  function Room() {
	    var id = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

	    _classCallCheck(this, Room);

	    _get(Object.getPrototypeOf(Room.prototype), 'constructor', this).call(this);
	    if (id) {
	      this.firebase = new Firebase(BASE_URL + '/rooms/' + id);
	    } else {
	      this.firebase = new Firebase(BASE_URL + '/rooms').push();
	    }

	    // this.createdAt is creation time
	    this.setCreatedAtAndStartTimers();

	    this.messagesFirebase = new Firebase(BASE_URL + '/messages/' + this.id);
	    Messaging.enableMessaging();
	    this.pollMessages();
	  }

	  // Dom elements

	  _createClass(Room, [{
	    key: 'setCreatedAtAndStartTimers',
	    value: function setCreatedAtAndStartTimers() {
	      var _this5 = this;

	      var timersStarted = false;

	      var createdAtFB = this.firebase.child('createdAt');
	      createdAtFB.on('value', function (snapshot) {
	        _this5.createdAt = snapshot.val();
	        if (!_this5.createdAt) {
	          createdAtFB.set(Firebase.ServerValue.TIMESTAMP);
	        } else if (!timersStarted) {
	          timersStarted = true;_this5.startTimers();
	        }
	      });
	    }
	  }, {
	    key: 'startTimers',
	    value: function startTimers() {
	      var timeToWarning = ONE_MIN_WARNING - this.timeOpen;
	      var timeToClose = ROOM_OPEN_TIME - this.timeOpen;
	      if (this.willBeWarned) {
	        setTimeout(function () {
	          return Messaging.sendSystemMessage('You have 1 minute remaining.');
	        }, timeToWarning);
	        setTimeout(Messaging.finishChat.bind(Messaging), timeToClose);
	      } else if (this.willBeClosed) {
	        setTimeout(Messaging.finishChat.bind(Messaging), timeToClose);
	      } else {
	        Messaging.finishChat();
	      }
	    }
	  }, {
	    key: 'updateFromUser',
	    value: function updateFromUser(snapshot) {
	      var id = snapshot.key();
	      var state = snapshot.val();

	      console.log('Room: User ' + id + ' is ' + state);

	      if (state === this.id) {
	        this.addUser(id);
	      } else {
	        this.removeUser(id);
	      }
	    }
	  }, {
	    key: 'sendMessage',
	    value: function sendMessage(userId, message) {
	      this.messagesFirebase.push({ userId: userId, message: message, created_at: Firebase.ServerValue.TIMESTAMP });
	    }

	    // Listen for messages and update HTML accordingly
	  }, {
	    key: 'pollMessages',
	    value: function pollMessages() {
	      this.messagesFirebase.limitToLast(10).on('child_added', function (snapshot) {
	        var data = snapshot.val();
	        var userId = data.userId;
	        var message = data.message;

	        Messaging.addMessageHTML(userId, message);
	      });
	    }
	  }, {
	    key: 'id',
	    get: function get() {
	      return this.firebase.key();
	    }
	  }, {
	    key: 'timeOpen',
	    get: function get() {
	      return Date.now() - this.createdAt;
	    }
	  }, {
	    key: 'willBeWarned',
	    get: function get() {
	      return this.timeOpen < ONE_MIN_WARNING;
	    }
	  }, {
	    key: 'willBeClosed',
	    get: function get() {
	      return this.timeOpen < ROOM_OPEN_TIME;
	    }
	  }]);

	  return Room;
	})(AbstractRoom);

	var MESSAGE_INPUT = $('#messageInput');
	var USER_ID_INPUT = $('#userId');
	var MESSAGES_ELEMENT = $('#messages');

	// Id entered should => new User
	currentUser = new CurrentUser(currentId);
	USER_ID_INPUT.val(currentId);
	USER_ID_INPUT.prop('disabled', true);

	// Send message when entered
	MESSAGE_INPUT.keypress(function (e) {
	  if (e.keyCode === 13) {
	    var message = MESSAGE_INPUT.val();
	    currentRoom.sendMessage(currentId, message);

	    // Blank input
	    MESSAGE_INPUT.val('');
	  }
	});

	/*eslint-enable */

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./chat.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./chat.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "/* Global */\nbody {\n  margin-top: 10px;\n  margin-left: auto;\n  margin-right: auto;\n  width: 526px;\n  background-color: #f8f8f8;\n  font-size: 24px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  color: #424547;\n  text-align: center; }\n\nh1 {\n  font-size: 36px;\n  font-weight: bold;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  color: #424547; }\n\nh3 {\n  font-size: 24px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  color: #424547; }\n\np {\n  font-size: 16px; }\n\ninput {\n  font-size: 24px; }\n\ninput[type=text] {\n  color: #424547;\n  border: 1px solid #c2c2c2;\n  background-color: white; }\n\ninput[disabled] {\n  background-color: #eee; }\n\nem {\n  font-style: normal;\n  font-weight: bold;\n  color: black; }\n\n.spacer {\n  width: 100%;\n  height: 30px; }\n\n/* Chat */\n#messages {\n  background-color: white;\n  overflow: auto;\n  height: 230px;\n  width: 526px;\n  padding: 10px;\n  border: 3px solid #424547;\n  margin-bottom: 5px;\n  text-align: left; }\n\n#messages .user {\n  position: relative;\n  float: left;\n  width: 120px;\n  margin-right: 10px;\n  font-weight: bold; }\n\n#messages .message {\n  position: relative;\n  float: left;\n  width: 370px; }\n\n#userId {\n  width: 50%; }\n\n#messageInput {\n  width: 68%; }\n\n/* JSON to CSV */\n#dataInput {\n  width: 400px;\n  height: 600px; }\n\n.csvResults {\n  margin-top: 20px; }\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);