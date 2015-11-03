import Firebase from 'firebase';

import AbstractRoom from './abstract-room';
import CHAT_CONSTANTS from './constants';
import Messaging from './messaging';

/**
 * Room allows 3 people to chat for ROOM_OPEN_TIME seconds
 * Polls messages and adds html when a new message is sent
 */
export default class Room extends AbstractRoom {
  constructor(id = undefined) {
    super();
    if (id) {
      this.firebase = new Firebase(`${CHAT_CONSTANTS.BASE_URL}/rooms/${id}`);
    } else {
      this.firebase = new Firebase(`${CHAT_CONSTANTS.BASE_URL}/rooms`).push();
    }

    // this.createdAt is creation time
    this.setCreatedAtAndStartTimers();

    this.messagesFirebase = new Firebase(`${CHAT_CONSTANTS.BASE_URL}/messages/${this.id}`);
    Messaging.enableMessaging();
    this.pollMessages();
  }

  get id() { return this.firebase.key(); }

  get timeOpen() { return Date.now() - this.createdAt; }
  get willBeWarned() { return this.timeOpen < ROOM_OPEN_TIME - WARNING; }
  get willBeClosed() { return this.timeOpen < ROOM_OPEN_TIME; }

  setCreatedAtAndStartTimers() {
    let timersStarted = false;

    const createdAtFB = this.firebase.child('createdAt');
    createdAtFB.on('value', (snapshot) => {
      this.createdAt = snapshot.val();
      if (!this.createdAt) {
        createdAtFB.set(Firebase.ServerValue.TIMESTAMP);
      } else if (!timersStarted) {
        timersStarted = true; this.startTimers();
      }
    });
  }

  startTimers() {
    const timeToWarning = ROOM_OPEN_TIME - WARNING - this.timeOpen;
    const timeToClose = ROOM_OPEN_TIME - this.timeOpen;
    if (this.willBeWarned) {
      setTimeout(() => Messaging.sendSystemMessage('You have 1 minute remaining.'), timeToWarning);
      setTimeout(Messaging.finishChat.bind(Messaging), timeToClose);
    } else if (this.willBeClosed) {
      setTimeout(Messaging.finishChat.bind(Messaging), timeToClose);
    } else {
      Messaging.finishChat();
    }
  }

  updateFromUser(snapshot) {
    const [id, state] = [snapshot.key(), snapshot.val()];
    console.log(`Room: User ${id} is ${state}`);

    if (state === this.id) {
      this.addUser(id);
    } else {
      this.removeUser(id);
    }
  }

  sendMessage(userId, message) {
    this.messagesFirebase.push({ userId, message, created_at: Firebase.ServerValue.TIMESTAMP });
  }

  // Listen for messages and update HTML accordingly
  pollMessages() {
    this.messagesFirebase.limitToLast(10).on('child_added', snapshot => {
      const data = snapshot.val();
      const [userId, message] = [data.userId, data.message];
      Messaging.addMessageHTML(userId, message);
    });
  }
}
