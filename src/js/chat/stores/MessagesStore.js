import alt from '../alt';

import MessagesActions from '../actions/MessagesActions';

const SYSTEM = 'System';

class MessagesStore {
  constructor() {
    this.bindActions(MessagesActions);

    this.messagingEnabled = false;
    this.messages = [];
  }

  onSystemMessage(message) {
    this.messages.push({ user: SYSTEM, message: message });
  }

  onMessage(message) {
    this.messages.push(message);
  }

  onEnableMessaging() {
    this.messagingEnabled = true;
  }

  onDisableMessaging() {
    this.messagingEnabled = false;
  }

  static getMessagingEnabled() {
    return this.getState().messagingEnabled;
  }

  static getMessages() {
    return this.getState().messages;
  }
}

export default alt.createStore(MessagesStore);
