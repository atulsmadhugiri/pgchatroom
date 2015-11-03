import alt from '../alt';
import UserActions from '../actions/user-actions';

class UserStore {
  constructor() {
    this.userId = null;

    this.bindListeners({
      handleGetInitialUserId: UserActions.GET_INITIAL_USER_ID,
    });
  }

  handleGetInitialUserId(userId) {
    this.userId = userId;
  }
}

export default alt.createStore(UserStore, 'UserStore');
