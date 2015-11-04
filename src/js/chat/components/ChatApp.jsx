import React from 'react';

import Message from './Message';

import MessagesStore from '../stores/MessagesStore';
import StudyActions from '../actions/StudyActions';
import StudyStore from '../stores/StudyStore';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';

function getStateFromStores() {
  return {
    study: StudyStore.getStudy(),
    config: StudyStore.getConfig(),
    userId: UserStore.getUserId(),
    userState: UserStore.getUserState(),
    messages: MessagesStore.getMessages(),
  };
}

const ChatApp = React.createClass({
  getInitialState() {
    return getStateFromStores();
  },

  componentDidMount() {
    UserStore.listen(this._onChange);
    StudyStore.listen(this._onChange);
    MessagesStore.listen(this._onChange);

    this._init();
  },

  _onChange() {
    this.setState(getStateFromStores());
  },

  _init() {
    StudyActions.initStudy();
    StudyActions.loadConfig(StudyStore.getConfigFb());

    // HACKHACKHACK: while I figure out how to call this method only after
    // config is loaded
    setTimeout(this._loadUser, 2500);
  },

  _loadUser() {
    UserActions.getInitialUserId();
    UserActions.loadAndListen({
      usersFb: StudyStore.getUsersFb(),
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
