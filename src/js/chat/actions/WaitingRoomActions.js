import alt from '../alt';
import _ from 'underscore';

import { filterObject } from '../util';
import RoomActions from './RoomActions';

class WaitingRoomActions {
  constructor() {
    this.generateActions('updateWaitingUsers');
  }

  listenForMoreUsers({ baseFb, usersFb, currentUserId }) {
    usersFb.on('value', snapshot => {
      const users = snapshot.val();
      const waitingUsers = filterObject(users,
        userState => userState === 'waiting');
      this.actions.updateWaitingUsers(waitingUsers);

      if (_.size(waitingUsers) >= 3 && _.has(waitingUsers, currentUserId)) {
        const matchedUsers = _.chain(waitingUsers)
          .keys()
          .filter(key => key !== currentUserId)
          .first(2)
          .value()
          .concat([currentUserId]);
        RoomActions.createRoom({ baseFb, matchedUsers });
      }
    });
  }
}

export default alt.createActions(WaitingRoomActions);
