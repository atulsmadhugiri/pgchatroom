import alt from '../alt';

import { assert } from '../util';
import MessagesActions from '../actions/MessagesActions';
import RoomActions from '../actions/RoomActions';
import RoomStore from './RoomStore';
import StudyStore from './StudyStore';
import { MESSAGE_TYPES } from '../../constants';

class MessagesStore {
  constructor() {
    this.bindActions(MessagesActions);
    this.bindAction(RoomActions.addUser, this.addUser);

    this.messagingEnabled = false;
    this.messagingFb = null;
    this.messages = [];
  }

  addUser() {
    this.waitFor(RoomStore);
    assert(RoomStore.get('roomId'), 'Room not loaded.');

    const baseFb = StudyStore.get('baseFb');
    const roomId = RoomStore.get('roomId');

    this.messagingFb = baseFb.child(`rooms/${roomId}/messages`);
  }

  systemMessage(message) {
    if (this.messagingFb) {
      this.messagingFb.push({ userId: MESSAGE_TYPES.system, message, generated: true });
    }
    this.messages.push({ userId: MESSAGE_TYPES.system, message: message });
  }

  receiveMessage(message) {
    if (message.userId !== MESSAGE_TYPES.system && !message.generated) {
      this.messages.push(message);
    }
  }

  enableMessaging() {
    this.messagingEnabled = true;
  }

  disableMessaging() {
    if (this.messagingFb) {
      this.messagingFb.off();
    }

    this.messagingEnabled = false;
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(MessagesStore);
