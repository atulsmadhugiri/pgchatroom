import alt from '../alt';
import _ from 'underscore';

import { assert, getAttributeFromUrlParams } from '../util';
import MessagesActions from './MessagesActions';
import WaitingRoomActions from './WaitingRoomActions';
import RoomActions from './RoomActions';

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

  loadAndListen({ StudyStore, UserStore, WaitingRoomStore, MessagesStore }) {
    assert(StudyStore.get('study') && StudyStore.get('config'),
      'Study not loaded.');
    assert(UserStore.get('userId'), 'User not loaded.');

    const userId = UserStore.get('userId');
    const userFb = StudyStore.get('usersFb').child(userId);

    const { maxWaitingTime, roomOpenTime } = StudyStore.get('config');

    this.dispatch(userFb);

    userFb.on('value', snapshot => {
      const userState = snapshot.val();
      this.actions.updateUser(userState);

      switch (userState) {
      case null:
        this.actions.createUser(userFb);
        break;
      case 'waiting':
        MessagesActions.waitingMessage(StudyStore);
        WaitingRoomActions.listenForMoreUsers(
          { StudyStore, UserStore, WaitingRoomStore });
        this.actions.startWaitingTime(userFb, maxWaitingTime);
        break;
      case 'early-done':
        MessagesActions.earlyFinishMessage(configWithFb);
        break;
      case 'done':
        userFb.off();
        MessagesActions.finishMessage(configWithFb);
        break;
      default: // User in room
        const roomId = userState;
        RoomActions.addUser({ StudyStore, UserStore, roomId });
        MessagesActions.startMessage({ StudyStore, MessagesStore });
        this.actions.startChatTime(userFb, roomOpenTime);
      }
    });
  }

  createUser(userFb) {
    userFb.set('waiting');
  }

  setUsersToRoom({ StudyStore, roomId, matchedUsers }) {
    const usersFb = StudyStore.get('usersFb');

    usersFb.update(
      _.object(matchedUsers, matchedUsers.map(() => roomId))
    );
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

  startChatTime(userFb, roomOpenTime) {
    console.log('Starting chat timer...');
    setTimeout(() => {
      userFb.set('done');
    }, roomOpenTime);
  }
}

export default alt.createActions(UserActions);
