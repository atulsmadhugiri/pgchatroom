import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

// const DEFAULT_ROOM_LIST = {};

const RoomsList = React.createClass({

  getInitialState() {
    return {
      loaded: false,
      rooms: {},
    };
  },

  componentWillMount() {
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

  _removeRoom() {
    // Removes room
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
    return _.keys(this.state.rooms).map(key => {
      return (
        <tr key={key}>
          <td>{key}</td>
          <td onClick={this._removeRoom}>&times;</td>
        </tr>
      );
    });
  },

  render() {
    return <div>{this._renderRoomsTable()}</div>;
  },
});

export default RoomsList;
