import alt from '../alt';

class MessagingActions {
  constructor() {
    this.generateActions('systemMessage');
  }
}

export default alt.createActions(MessagingActions);
