import alt from '../alt';

import WaitingRoomActions from '../actions/WaitingRoomActions';

class WaitingRoomStore {
  constructor() {
    this.bindActions(WaitingRoomActions);

    this.waitingUsers = null;
  }

  updateWaitingUsers(waitingUsers) {
    this.waitingUsers = waitingUsers;
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(WaitingRoomStore);
