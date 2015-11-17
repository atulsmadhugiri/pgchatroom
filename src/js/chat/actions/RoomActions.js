import alt from '../alt';

class RoomActions {
  constructor() {
    // this.generateActions('addUser');
  }

  createRoom(StudyStore) {
    const roomFb = StudyStore.get('baseFb').child('rooms').push();
    this.dispatch(roomFb);

    return roomFb.key();
  }

  addUser({ StudyStore, UserStore, roomId }) {
    const baseFb = StudyStore.get('baseFb');
    const userId = UserStore.get('userId');

    const roomFb = baseFb.child(`rooms/${roomId}`);
    roomFb.child('users').update({ [userId]: true });

    // Dispatch both roomFb and userId in case we haven't created room yet
    this.dispatch({ roomFb, userId });
  }
}

export default alt.createActions(RoomActions);
