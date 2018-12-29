import alt from '../alt';

import RoomActions from '../actions/RoomActions';

class RoomStore {
  constructor() {
    this.bindActions(RoomActions);

    this.roomFb = null;
    this.roomId = null;
    this.roomTime = null;
    this.userIds = [];
  }

  createRoomAndListen(roomFb) {
    this.roomFb = roomFb;
    this.roomId = roomFb.key();
  }

  addUser({ roomFb, userId }) {
    this.roomFb = roomFb;
    this.roomId = roomFb.key();

    this.roomFb.on('value', (snapshot) => {
      this.roomTime = snapshot.val().createdAt;
      this.getInstance().emitChange();
    });
  }

  addUsers({ userIds }) {
    this.userIds = userIds;
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(RoomStore);
