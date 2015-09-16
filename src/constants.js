const urlRegex = /room=(\w+)/;
const userIdRegex = /user_id=(\w+)/;

const getRoom = () => {
  const roomParams = urlRegex.exec(location.search);
  if (!roomParams) { throw new Error('Missing room in URL!'); }
  return roomParams[1];
};
