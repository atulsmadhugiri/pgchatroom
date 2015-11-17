import React from 'react';

import Message from './Message';
import MessagesActions from '../actions/MessagesActions';
import StudyActions from '../actions/StudyActions';
import UserActions from '../actions/UserActions';

import MessagesStore from '../stores/MessagesStore';
import RoomStore from '../stores/RoomStore';
import StudyStore from '../stores/StudyStore';
import UserStore from '../stores/UserStore';
import WaitingRoomStore from '../stores/WaitingRoomStore';

function getStateFromStores() {
  return {
    config: StudyStore.get('config'),
    userId: UserStore.get('userId'),
    study: StudyStore.get('study'),
    messages: MessagesStore.get('messages'),
    messagingEnabled: MessagesStore.get('messagingEnabled'),
    // These aren't necessary but are useful for debugging
    userState: UserStore.get('userState'),
    waitingUsers: WaitingRoomStore.get('waitingUsers'),
    roomId: RoomStore.get('roomId'),
  };
}

const ChatApp = React.createClass({
  getInitialState() {
    return {
      ...getStateFromStores(),
      message: '',
    };
  },

  componentWillMount() {
    const stores = [
      StudyStore,
      UserStore,
      MessagesStore,
      WaitingRoomStore,
      RoomStore,
    ];
    stores.forEach(store => store.listen(this._onChange));

    this._init();
  },

  componentDidUpdate() {
    if (this.state.messagingEnabled) {
      // Scroll to bottom of chat
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    }
  },

  _onChange() {
    this.setState(getStateFromStores());
  },

  _onInputChange(e) {
    this.setState({ message: e.target.value });
  },

  async _init() {
    StudyActions.initStudy();
    await StudyActions.loadConfig(StudyStore.get('configFb'));

    UserActions.getInitialUserId();
    UserActions.loadAndListen({ StudyStore, UserStore,
      MessagesStore, WaitingRoomStore, RoomStore });
  },

  _sendMessage(e) {
    e.preventDefault();
    if (this.state.message === '') {
      return;
    }

    MessagesActions.sendMessage({
      MessagesStore,
      userId: this.state.userId,
      message: this.state.message,
    });
    this.setState({ message: '' });
  },

  render() {
    console.log(this.state);
    // TODO(sam): Show error message if user id not present in url
    if (!this.state.userId || !this.state.study || !this.state.config) {
      return <div>Loading...</div>;
    }

    const messages = this.state.messages.map((message, i) => {
      return (
        <Message userId={message.userId}
          message={message.message}
          key={i} />
      );
    });

    return (
      <div>
        <h1>Chat Room</h1>

        <div>
          Your user ID is: {this.state.userId}
        </div>

        <div className="spacer"></div>

        <div className="messages"
             ref="messages">
          {messages}
        </div>

        <div className="spacer"></div>

        <form onSubmit={this._sendMessage}>
          <input type="text"
            placeholder="Type a message"
            onChange={this._onInputChange}
            value={this.state.message}
            disabled={!this.state.messagingEnabled} />
        </form>
      </div>
    );
  },
});

export default ChatApp;
