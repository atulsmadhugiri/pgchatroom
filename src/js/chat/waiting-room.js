import CHAT_CONSTANTS from './constants';

/**
 * WaitingRoom is where users get placed on creation.
 * this.canCreateNewRoom(user_id) - returns true if a new room can be made with the newest user_id
 * this.createNewRoom(newest_user_id) - makes a new Room with 3 users
 */
export default class WaitingRoom extends AbstractRoom {
  constructor() {
    super('waiting');
  }

  canCreateNewRoom(userId) {
    return this.numUsers === USERS_PER_ROOM - 1 && userId === currentId;
  }

  handleNewUser(id) {
    if (this.canCreateNewRoom(id)) {
      console.log('Creating a new room');
      this.createNewRoom(id);
    } else {
      this.addUser(id);
    }
  }

  updateFromUser(snapshot) {
    const [id, state] = [snapshot.key(), snapshot.val()];
    console.log(`WaitingRoom: User ${id} is ${state}`);

    if (state === 'waiting') {
      this.handleNewUser(id);
    } else {
      this.removeUser(id);
    }
  }

  createNewRoom(newestUserId) {
    currentRoom = new Room();
    const userIds = Object.keys(this.users).slice(-2).concat([newestUserId]);
    userIds.forEach(id => {
      CHAT_CONSTANTS.USERS_FIREBASE.child(id).set(currentRoom.id);
    });
  }
}
