import alt from '../alt';

class RoomActions {
  constructor() {
    // this.generateActions('addUser');
  }

  createRoom(baseFb) {
    const roomFb = baseFb.child('rooms').push();
    this.dispatch(roomFb);

    return roomFb.key();
  }

  addUser({ baseFb, userId, roomId }) {
    const roomFb = baseFb.child(`rooms/${roomId}`);
    roomFb.child('users').update({ [userId]: true });
    this.dispatch(userId);
  }
}

export default alt.createActions(RoomActions);
