const ROOT_URL = 'https://research-chat-room.firebaseio.com';
// const ROOT_URL = `ws://127.0.1:5000`;
const STUDIES_URL = `${ROOT_URL}/studies`;
const CONSTANTS_URL = `${ROOT_URL}/constants`;

const DEFAULT_ROOM_VALUES = {
  usersPerRoom: '3',
  maxWaitingTime: 300000,
  roomOpenTime: 180000,
  warning: 60000,
  password: 'password',
  altPassword: 'altpassword',
};

export default {
  ROOT_URL,
  STUDIES_URL,
  CONSTANTS_URL,
  DEFAULT_ROOM_VALUES,
};
