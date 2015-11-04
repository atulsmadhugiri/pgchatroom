import Firebase from 'firebase';

const BASE_URL = `https://research-chat-room.firebaseio.com/${getAttributeFromUrlParams(ROOM_REGEX)}`;

const CHAT_CONSTANTS = {
  ROOM_REGEX: ROOM_REGEX,
  USER_ID_REGEX: USER_ID_REGEX,
  BASE_URL: BASE_URL,
  USERS_FIREBASE: new Firebase(`${BASE_URL}/users`),
};

export default CHAT_CONSTANTS;
