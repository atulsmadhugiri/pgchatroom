import alt from '../alt';

import MessagesActions from '../actions/MessagesActions';

const SYSTEM = 'System';

class MessagesStore {
  constructor() {
    this.bindActions(MessagesActions);

    this.messages = [];
  }

  onSystemMessage(message) {
    this.messages.push({ user: SYSTEM, message: message });
  }

  message(message) {
    this.messages.push(message);
  }

  static getMessages() {
    return this.getState().messages;
  }
}

export default alt.createStore(MessagesStore);
