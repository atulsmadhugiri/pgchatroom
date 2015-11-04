import React from 'react';

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
  };
}

const ChatApp = React.createClass({
  getInitialState() {
    return getStateFromStores();
  },

  componentDidMount() {
    UserStore.listen(this._onChange);
    StudyStore.listen(this._onChange);

    this._init();
  },

  _onChange() {
    this.setState(getStateFromStores());
  },

  _init() {
    StudyActions.initStudy();
    StudyActions.loadConfig(StudyStore.getConfigFb());

    UserActions.getInitialUserId();
    UserActions.loadAndListen(StudyStore.getUsersFb(), UserStore.getUserId());
  },

  render() {
    console.log(this.state);
    // TODO(sam): Show error message if user id not present in url
    if (!this.state.userId || !this.state.study || !this.state.config) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h1>Chat Room</h1>

        <div>
          Your user ID is: {this.state.userId}
        </div>

        <div className="spacer"></div>
        <div id="messages"></div>
        <div className="spacer"></div>

        <input type="text"
          placeholder="Type a message"
          disabled />
      </div>
    );
  },
});

export default ChatApp;
