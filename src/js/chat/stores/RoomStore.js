import alt from '../alt';

import RoomActions from '../actions/RoomActions';

class RoomStore {
  constructor() {
    this.bindActions(RoomActions);

    this.roomFb = null;
    this.roomId = null;
    this.userIds = [];
  }

  onCreateRoomAndListen(roomFb) {
    this.roomFb = roomFb;
    this.roomId = roomFb.key();
  }

  onAddUser(userId) {
    this.userIds.push(userId);
  }

  static getRoomFb() {
    return this.getState().roomFb;
  }

  static getRoomId() {
    return this.getState().roomId;
  }

  static getUserIds() {
    return this.getState().userIds;
  }
}

export default alt.createStore(RoomStore);
