import alt from '../alt';

import UserActions from '../actions/UserActions';

class UserStore {
  constructor() {
    // this.bindActions(UserActions);
    this.bindListeners({
      onGetInitialUserId: UserActions.getInitialUserId,
      onUpdateUser: UserActions.updateUser,
    });

    this.userId = null;
    this.userState = null;
  }

  onGetInitialUserId(userId) {
    this.userId = userId;
  }

  onUpdateUser(userState) {
    this.userState = userState;
  }

  static getUserId() {
    return this.getState().userId;
  }

  static getUserState() {
    return this.getState().userState;
  }
}

export default alt.createStore(UserStore, 'UserStore');
