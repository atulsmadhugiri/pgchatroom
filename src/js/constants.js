export const ROOT_URL = 'https://research-chat-room.firebaseio.com';
// const ROOT_URL = `ws://127.0.1:5000`;
export const STUDIES_URL = `${ROOT_URL}/studies`;
export const CONSTANTS_URL = `${ROOT_URL}/constants`;
export const USER_AUTH_URL = `${ROOT_URL}/user_auth`;

export const BASE_CHAT_ROOM_URL = 'https://www.samlau.me/pg-chat-room';

export const DEFAULT_ROOM_VALUES = {
  usersPerRoom: '3',
  maxWaitingTime: 300000,
  roomOpenTime: 180000,
  password: 'password',
  altPassword: 'altpassword',
  messages: {},
};

export const MESSAGE_TYPES = {
  system: 'System',
  confederate: 'Confederate',
};

export default {
  ROOT_URL,
  STUDIES_URL,
  CONSTANTS_URL,
  USER_AUTH_URL,
  BASE_CHAT_ROOM_URL,
  DEFAULT_ROOM_VALUES,
  MESSAGE_TYPES,
};
