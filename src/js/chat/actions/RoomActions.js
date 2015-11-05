import alt from '../alt';

class RoomActions {
  constructor() {
    // this.generateActions('');
  }

  createRoom({ baseFb, matchedUsers }) {
    console.log(baseFb.toString(), matchedUsers);
    debugger;
  }
}

export default alt.createActions(RoomActions);
