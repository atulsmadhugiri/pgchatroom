import alt from '../alt';

import UserActions from '../actions/UserActions';

class UserStore {
  constructor() {
    this.bindActions(UserActions);

    this.userId = null;
    this.userState = null;
    this.userFb = null;
  }

  getInitialUserId(userId) {
    this.userId = userId;
  }

  loadAndListen(userFb) {
    this.userFb = userFb;
  }

  updateUser(userState) {
    this.userState = userState;
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(UserStore, 'UserStore');
