import alt from '../alt';

import RoomActions from '../actions/RoomActions';

class RoomStore {
  constructor() {
    this.bindActions(RoomActions);

    this.roomFb = null;
    this.roomId = null;
    this.userIds = [];
  }

  createRoomAndListen(roomFb) {
    this.roomFb = roomFb;
    this.roomId = roomFb.key();
  }

  addUser({ roomFb, userId }) {
    this.roomFb = roomFb;
    this.roomId = roomFb.key();
    this.userIds.push(userId);
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(RoomStore);
