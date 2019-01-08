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

  loadAndListen({ RoomStore, StudyStore, UserStore, WaitingRoomStore, MessagesStore }) {
    assert(StudyStore.get('study') && StudyStore.get('config'),
      'Study not loaded.');
    assert(UserStore.get('userId'), 'User not loaded.');

    const userId = UserStore.get('userId');
    const userFb = StudyStore.get('usersFb').child(userId);
    const userAuthFb = StudyStore.get('userAuthFb');

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
        console.log('waiting');
        MessagesActions.waitingMessage({ MessagesStore, UserStore, RoomStore, StudyStore });
        WaitingRoomActions.listenForMoreUsers(
          { RoomStore, StudyStore, UserStore, WaitingRoomStore });
        this.actions.startWaitingTime(userFb, maxWaitingTime);
        break;
      case 'early-done':
        this.actions.logout(userAuthFb);
        userFb.off();
        MessagesActions.earlyFinishMessage({ MessagesStore, UserStore, RoomStore, StudyStore });
        break;
      case 'done':
        this.actions.logout(userAuthFb);
        userFb.off();
        MessagesActions.finishMessage({ MessagesStore, UserStore, RoomStore, StudyStore });
        break;
      default: // User in room
        const roomId = userState;
        RoomActions.addUser({ StudyStore, UserStore, roomId });
        MessagesActions.startMessage({ MessagesStore, UserStore, RoomStore, StudyStore });
        this.actions.startChatTime(userFb, roomOpenTime);
      }
    });
  }

  createUser(userFb) {
    userFb.set('waiting');
  }

  authUser(userId, userAuthFb) {
    this.dispatch();

    return new Promise((resolve, reject) => {
      userAuthFb.authAnonymously((err, auth) => {
        if (err) {
          throw Error(`Login failed: ${err.toString()}`);
        } else {
          userAuthFb.child(auth.uid).set(userId);
          resolve(auth);
        }
      });
    });
  }

  logout(userAuthFb) {
    userAuthFb.unauth();
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
