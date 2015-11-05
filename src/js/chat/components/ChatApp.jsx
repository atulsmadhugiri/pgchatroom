import React from 'react';

import Message from './Message';
import MessagesStore from '../stores/MessagesStore';
import StudyActions from '../actions/StudyActions';
import StudyStore from '../stores/StudyStore';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import WaitingRoomStore from '../stores/WaitingRoomStore';

function getStateFromStores() {
  return {
    config: StudyStore.getConfig(),
    userId: UserStore.getUserId(),
    messages: MessagesStore.getMessages(),
    // These aren't necessary but are useful for debugging
    study: StudyStore.getStudy(),
    userState: UserStore.getUserState(),
    waitingUsers: WaitingRoomStore.getWaitingUsers(),
  };
}

const ChatApp = React.createClass({
  getInitialState() {
    return getStateFromStores();
  },

  componentDidMount() {
    const stores = [
      StudyStore,
      UserStore,
      MessagesStore,
      WaitingRoomStore,
    ];
    stores.forEach(store => store.listen(this._onChange));

    this._init();
  },

  _onChange() {
    this.setState(getStateFromStores());
  },

  async _init() {
    StudyActions.initStudy();
    await StudyActions.loadConfig(StudyStore.getConfigFb());

    UserActions.getInitialUserId();
    UserActions.loadAndListen({
      baseFb: StudyStore.getBaseFb(),
      userId: UserStore.getUserId(),
      config: StudyStore.getConfig(),
    });
  },

  render() {
    console.log(this.state);
    // TODO(sam): Show error message if user id not present in url
    if (!this.state.userId || !this.state.study || !this.state.config) {
      return <div>Loading...</div>;
    }

    const messages = this.state.messages.map((message, i) => {
      return <Message user={message.user} message={message.message} key={i} />;
    });

    return (
      <div>
        <h1>Chat Room</h1>

        <div>
          Your user ID is: {this.state.userId}
        </div>

        <div className="spacer"></div>

        <div className="messages">{messages}</div>

        <div className="spacer"></div>

        <input type="text"
          placeholder="Type a message"
          disabled />
      </div>
    );
  },
});

export default ChatApp;
