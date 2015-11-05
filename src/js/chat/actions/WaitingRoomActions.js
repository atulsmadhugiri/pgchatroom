import alt from '../alt';
import _ from 'underscore';

import { filterObject } from '../util';
import RoomActions from './RoomActions';
import UserActions from './UserActions';

class WaitingRoomActions {
  constructor() {
    this.generateActions('updateWaitingUsers');
  }

  listenForMoreUsers({ baseFb, usersFb, currentUserId, config }) {
    const { usersPerRoom } = config;
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
        this.actions.sendUsersToRoom({
          baseFb, usersFb, waitingUsers, currentUserId, usersPerRoom });
      }
    });
  }

  sendUsersToRoom({ baseFb, usersFb, waitingUsers,
      currentUserId, usersPerRoom }) {
    usersFb.off();

    const matchedUsers = _.chain(waitingUsers)
      .keys()
      .filter(key => key !== currentUserId)
      .first(usersPerRoom - 1)
      .value()
      .concat([currentUserId]);
    const roomId = RoomActions.createRoom(baseFb);

    UserActions.setUsersToRoom({
      usersFb,
      roomId,
      users: matchedUsers,
    });
  }
}

export default alt.createActions(WaitingRoomActions);
