import alt from '../alt';
import _ from 'underscore';

import { filterObject } from '../util';
import RoomActions from './RoomActions';
import UserActions from './UserActions';

class WaitingRoomActions {
  constructor() {
    this.generateActions('updateWaitingUsers');
  }

  listenForMoreUsers({ StudyStore, UserStore, WaitingRoomStore }) {
    const usersFb = StudyStore.get('usersFb');
    const usersPerRoom = StudyStore.get('config').usersPerRoom;
    const currentUserId = UserStore.get('userId');

    usersFb.on('value', snapshot => {
      const users = snapshot.val();
      const waitingUsers = filterObject(users,
        userState => userState === 'waiting');
      this.actions.updateWaitingUsers(waitingUsers);

      // This might cause 3 rooms to be created (one for each user
      // that gets matched).
      // TODO(sam): Ensure that only one room gets created
      if (_.size(waitingUsers) >= usersPerRoom &&
          _.has(waitingUsers, currentUserId)) {
        this.actions.sendUsersToRoom(
          { StudyStore, UserStore, WaitingRoomStore });
      }
    });
  }

  sendUsersToRoom({ StudyStore, UserStore, WaitingRoomStore }) {
    const usersFb = StudyStore.get('usersFb');
    const currentUserId = UserStore.get('userId');
    const usersPerRoom = StudyStore.get('config').usersPerRoom;
    const waitingUsers = WaitingRoomStore.get('waitingUsers');

    usersFb.off();

    const matchedUsers = _.chain(waitingUsers)
      .keys()
      .filter(key => key !== currentUserId)
      .first(usersPerRoom - 1)
      .value()
      .concat([currentUserId]);
    const roomId = RoomActions.createRoom(StudyStore);

    debugger;

    UserActions.setUsersToRoom({
      StudyStore,
      roomId,
      matchedUsers,
    });
  }
}

export default alt.createActions(WaitingRoomActions);
