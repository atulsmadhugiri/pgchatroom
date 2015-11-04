import alt from '../alt';

import { getAttributeFromUrlParams } from '../util';

const USER_ID_REGEX = /user_id=(\w+)/;

class UserActions {
  constructor() {
    this.generateActions('updateUser');
  }

  getInitialUserId() {
    const userId = getAttributeFromUrlParams(USER_ID_REGEX);
    if (!userId) { throw new Error('Missing user_id in url!'); }

    console.log(userId);
    this.dispatch(userId);
  }

  loadAndListen(usersFb, userId) {
    this.dispatch();

    const userFb = usersFb.child(userId);
    userFb.on('value', snapshot => {
      const userState = snapshot.val();
      this.actions.updateUser(userState);

      switch (userState) {
      case null:
        this.actions.createUser(userFb, userId);
        break;
      case 'waiting':
        // TODO(sam): Send waiting system message
        this.actions.startWaitingTime(userFb);
        break;
      case 'early-done':
        // TODO(sam): End chat
        break;
      case 'done':
        // TODO(sam): End chat
        break;
      default: // User in room
        // TODO(sam): Start chat
      }
    });
  }

  createUser(userFb) {
    userFb.set('waiting');
    this.dispatch();
  }

  startWaitingTime(userFb) {
    setTimeout(() => {
      userFb.once('value', snapshot => {
        const userState = snapshot.val();
        if (userState === 'waiting') {
          userFb.set('early-done');
        }
      });
    }, 10000);
  }
}

export default alt.createActions(UserActions);
