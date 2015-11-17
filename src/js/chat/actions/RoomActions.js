import alt from '../alt';
import Firebase from 'firebase';

class RoomActions {
  constructor() {
    // this.generateActions('addUser');
  }

  createRoom(StudyStore) {
    const roomFb = StudyStore.get('baseFb').child('rooms').push();

    // TODO(sam): Read createdAt and use that to determine the time left
    // instead of just waiting the roomOpenTime.
    const createdAt = Firebase.ServerValue.TIMESTAMP;
    roomFb.set({ createdAt });

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
