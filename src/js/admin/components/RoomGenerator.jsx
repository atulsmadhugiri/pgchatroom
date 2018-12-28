import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import { BASE_CHAT_ROOM_URL } from '../../constants';

const USER_ID_FIELD = 'user_id=$]/{e://Field/CHATROOM%20ID}';

/**
 * Presentational component that generates URLs for specific rooms in a study.
 */
class RoomGenerator extends React.Component {
  getInitialState() {
    return {
      room: '',
    };
  }

  getChatRoomUrl() {
    if (_.isEmpty(this.state.room)) {
      return '';
    }

    return `${BASE_CHAT_ROOM_URL}/`
      + `?study=${this.props.selectedStudy}`
      + `&room=${this.state.room}`
      + `&${USER_ID_FIELD}`;
  }

  handleSubmit(e) {
    e.preventDefault();
    const roomInput = this.refs.roomInput;
    this.setState({ room: roomInput.value });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="roomInput">
              Generate a room for
              {this.props.selectedStudy}
            </label>
            <input
              ref="roomInput"
              type="text"
              id="roomInput"
              placeholder="Room name"
            />
          </div>

          <button name="submit">Generate</button>
        </form>
        <p>{this.getChatRoomUrl()}</p>
      </div>
    );
  }
}

RoomGenerator.propTypes = {
  selectedStudy: PropTypes.string.isRequired,
};

export default RoomGenerator;
