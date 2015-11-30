import React from 'react';
import _ from 'underscore';

const USER_ID_FIELD = 'user_id=${e://Field/CHATROOM%20ID}';

const RoomGenerator = React.createClass({
  propTypes: {
    selectedStudy: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      room: '',
    };
  },

  _handleSubmit(e) {
    e.preventDefault();
    const roomInput = this.refs.roomInput;
    this.setState({ room: roomInput.value });
  },

  _getChatRoomUrl() {
    if (_.isEmpty(this.state.room)) {
      return '';
    }

    return `https://samlau95.github.io/pg-chat-room?study=` +
      `${this.props.selectedStudy}&room=${this.state.room}&${USER_ID_FIELD}`;
  },

  render() {
    return (
      <div>
        <form onSubmit={this._handleSubmit}>
          <div>
            <label htmlFor="roomInput">
              Generate a room for {this.props.selectedStudy}
            </label>
            <input
              ref="roomInput"
              type="text"
              id="roomInput"
              placeholder="Room name" />
          </div>

          <button name="submit">Generate</button>
        </form>
        <p>{this._getChatRoomUrl()}</p>
      </div>
    );
  },
});

export default RoomGenerator;
