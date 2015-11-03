import React from 'react';

import UserActions from '../actions/user-actions';
import UserStore from '../stores/user-store';

const ChatApp = React.createClass({
  getInitialState() {
    return UserStore.getState();
  },

  componentDidMount() {
    UserStore.listen(this._onChange);

    UserActions.getInitialUserId();
  },

  componentWillUnmount() {
    UserStore.unlisten(this._onChange);
  },

  _onChange(state) {
    this.setState(state);
  },

  render() {
    // TODO(sam): Show error message if user id not present in url
    if (!this.state.userId) {
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
