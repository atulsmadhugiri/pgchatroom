const ROOM_REGEX = /room=(\w+)/;
const USER_ID_REGEX = /user_id=(\w+)/;

const getAttributeFromUrlParams = (regex, attr) => {
  const params = regex.exec(location.search);
  if (!params) { throw new Error(`Missing ${attr} in URL!`); }
  return params[1];
};
