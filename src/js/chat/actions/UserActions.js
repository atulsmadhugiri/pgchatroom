import alt from '../alt';

import { getAttributeFromUrlParams } from '../util';
import MessagesActions from './MessagesActions';
import WaitingRoomActions from './WaitingRoomActions';

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

  loadAndListen({ baseFb, userId, config }) {
    this.dispatch();

    const { maxWaitingTime, password, altPassword } = config;
    const usersFb = baseFb.child('users');
    const userFb = usersFb.child(userId);

    userFb.on('value', snapshot => {
      const userState = snapshot.val();
      this.actions.updateUser(userState);

      switch (userState) {
      case null:
        this.actions.createUser(userFb, userId);
        break;
      case 'waiting':
        MessagesActions.startMessage(maxWaitingTime);
        WaitingRoomActions.listenForMoreUsers({
          baseFb,
          usersFb,
          currentUserId: userId,
        });
        this.actions.startWaitingTime(userFb, maxWaitingTime);
        break;
      case 'early-done':
        MessagesActions.earlyFinishMessage(altPassword);
        break;
      case 'done':
        MessagesActions.finishMessage(password);
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
    console.log('Starting wait timer...');
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
