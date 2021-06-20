const ROOT_URL = 'https://research-chat-room.firebaseio.com';
// const ROOT_URL = `ws://127.0.1:5000`;
const STUDIES_URL = `${ROOT_URL}/studies`;
const CONSTANTS_URL = `${ROOT_URL}/constants`;
const USER_AUTH_URL = `${ROOT_URL}/user_auth`;

const BASE_CHAT_ROOM_URL = 'https://www.samlau.me/pg-chat-room';

const DEFAULT_ROOM_VALUES = {
  usersPerRoom: '3',
  maxWaitingTime: 300000,
  roomOpenTime: 180000,
  password: 'password',
  altPassword: 'altpassword',
  messages: {},
};

const MESSAGE_TYPES = {
  system: 'System',
  confederate: 'Confederate',
};

export {
  ROOT_URL,
  STUDIES_URL,
  CONSTANTS_URL,
  USER_AUTH_URL,
  BASE_CHAT_ROOM_URL,
  DEFAULT_ROOM_VALUES,
  MESSAGE_TYPES,
};
