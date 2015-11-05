import alt from '../alt';

import WaitingRoomActions from '../actions/WaitingRoomActions';

class WaitingRoomStore {
  constructor() {
    this.bindActions(WaitingRoomActions);

    this.waitingUsers = null;
  }

  onUpdateWaitingUsers(waitingUsers) {
    this.waitingUsers = waitingUsers;
  }

  static getWaitingUsers() {
    return this.getState().waitingUsers;
  }
}

export default alt.createStore(WaitingRoomStore);
