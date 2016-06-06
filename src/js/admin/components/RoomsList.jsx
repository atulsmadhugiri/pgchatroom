import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import { ROOT_URL } from '../../constants';

function deleteMessage(object) {
  return `Are you sure you want to delete this ${object}? This cannot be undone.`;
}

const RoomsList = React.createClass({
  propTypes: {
    roomsUrl: React.PropTypes.string,
    study: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      loaded: false,
      rooms: {},
    };
  },

  componentDidMount() {
    this._loadRooms(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this._loadRooms(nextProps);
  },

  _loadRooms(props) {
    if (!_.isUndefined(props.roomsUrl)) {
      $.get(props.roomsUrl).done((result) => {
        if (!_.isEmpty(result)) {
          this.setState({ rooms: result });
        }
      });
    }
  },

  _removeRoom(e) {
    const confirmDelete = confirm(deleteMessage('room'));
    const room = e.target.parentElement.id;
    if (confirmDelete) {
      const roomFb = new Firebase(`${ROOT_URL}/${this.props.study}/${room}`);
      roomFb.remove(() => {
        const rooms = this.state.rooms;
        delete rooms[room];
        this.setState({ rooms: rooms });
      });
    }
  },

  _renderRoomsTable() {
    if (_.isEmpty(this.state.rooms)) {
      return '';
    }

    const tableStyle = {
      margin: '0 auto',
    };

    return (
      <div>
        <h3>List of Rooms</h3>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <th>Room</th>
              <th>Delete</th>
            </tr>
            {this._renderRooms()}
          </tbody>
        </table>
      </div>
    );
  },

  _renderRooms() {
    const xStyle = {
      cursor: 'pointer',
    };

    return _.keys(this.state.rooms).map(key => {
      return (
        <tr key={key} id={key}>
          <td>{key}</td>
          <td style={xStyle} onClick={this._removeRoom}>&times;</td>
        </tr>
      );
    });
  },

  render() {
    return <div>{this._renderRoomsTable()}</div>;
  },
});

export default RoomsList;
