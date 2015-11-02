import Firebase from 'firebase';

const ROOM_REGEX = /room=(\w+)/;
const USER_ID_REGEX = /user_id=(\w+)/;

const getAttributeFromUrlParams = (regex, attr) => {
  const params = regex.exec(location.search);
  if (!params) { throw new Error(`Missing ${attr} in URL!`); }
  return params[1];
};

/*

ROOM SETUP

*/

// Grab room from URL
const ROOM_PARAMS = ROOM_REGEX.exec(location.search);
if (!ROOM_PARAMS) { throw new Error('Missing room in URL!'); }


// Grab user_id from URL
const USER_ID_PARAMS = USER_ID_REGEX.exec(location.search);
if (!USER_ID_PARAMS) { throw new Error('Missing user_id in URL!'); }

const BASE_URL = `https://research-chat-room.firebaseio.com/${getAttributeFromUrlParams(ROOM_REGEX)}`;

const CHAT_CONSTANTS = {
  ROOM: getAttributeFromUrlParams(ROOM_REGEX),
  USER_ID: getAttributeFromUrlParams(USER_ID_REGEX),
  BASE_URL: BASE_URL,
  USERS_FIREBASE: new Firebase(`${BASE_URL}/users`),
};

export default CHAT_CONSTANTS;
