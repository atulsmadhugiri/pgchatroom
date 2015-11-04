import alt from '../alt';

import { getAttributeFromUrlParams } from '../util';
import MessagesActions from './MessagesActions';

const USER_ID_REGEX = /user_id=(\w+)/;

class UserActions {
  constructor() {
    this.generateActions('updateUser');
  }

  getInitialUserId() {
    const userId = getAttributeFromUrlParams(USER_ID_REGEX);
    if (!userId) { throw new Error('Missing user_id in url!'); }

    this.dispatch(userId);
  }

  loadAndListen(opts = {}) {
    this.dispatch();

    const { usersFb, userId, config } = opts;
    const userFb = usersFb.child(userId);

    userFb.on('value', snapshot => {
      const userState = snapshot.val();
      this.actions.updateUser(userState);

      switch (userState) {
      case null:
        this.actions.createUser(userFb, userId);
        break;
      case 'waiting':
        MessagesActions.startMessage(config.maxWaitingTime);
        this.actions.startWaitingTime(userFb, config.maxWaitingTime);
        break;
      case 'early-done':
        // TODO(sam): Move this into constants
        MessagesActions.earlyFinishMessage('alternate123');
        break;
      case 'done':
        // TODO(sam): Move this into constants
        MessagesActions.finishMessage('complete123');
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

  startWaitingTime(userFb, waitingTime) {
    setTimeout(() => {
      userFb.once('value', snapshot => {
        const userState = snapshot.val();
        if (userState === 'waiting') {
          userFb.set('early-done');
        }
      });
    }, waitingTime);
  }
}

export default alt.createActions(UserActions);
