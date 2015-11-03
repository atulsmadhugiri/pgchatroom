import Firebase from 'firebase';

import CHAT_CONSTANTS from './constants';
import Messaging from './messaging';

// Just for reference, not used.
// const USER_STATES = ['waiting', 'room_id', 'done'];

/**
 * CurrentUser is the current user.
 * this.id - user id from Qualtrics
 * this.firebase - connection to Firebase for this user
 * this.isInRoom() - returns true if user is in a chat room
 */
class CurrentUser {
  constructor(id) {
    this.id = id;
    this.firebase = new Firebase(`${CHAT_CONSTANTS.BASE_URL}/users/${this.id}`);
    this.pollState();
    this.setWaitingTime();
  }

  isWaiting() { return this.state === 'waiting'; }
  isInRoom() { return this.state !== 'waiting' && this.state !== 'done'; }
  isDone() { return this.state === 'done'; }

  // Grab previous state from Firebase or set as waiting
  // [Minor bug]: When currentUser is set, this doesn't allow user deletion through Firebase
  pollState() {
    this.firebase.on('value', snapshot => {
      this.state = snapshot.val();
      // console.log(this.state);
      if (!this.state) {
        this.firebase.set('waiting');
      } else if (this.isWaiting()) {
        Messaging.sendSystemMessage('Please wait while we match you to a room. If we are not able to ' +
          'match you in 3 minutes you will be able to move on to the next part of the survey.');
      } else if (this.isInRoom()) {
        currentRoom = currentRoom || new Room(this.state);
      } else if (this.isDone()) {
        Messaging.disableMessaging();
      }
    });
  }

  setWaitingTime() {
    setTimeout(() => {
      if (this.state === 'waiting') {
        this.firebase.set('done');
        Messaging.earlyFinish();
      }
    }, MAX_WAITING_TIME);
  }
}
