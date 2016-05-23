import React from 'react';
import _ from 'underscore';

const DEFAULT_ROOM_LIST = {};

const RoomsList = React.createClass({

  getInitialState() {
    return {
      loaded: false,
      rooms: {},
    }
  },

  componentWillMount() {
    this._loadRooms(this.props);
  },

  componentWillRecieveProps(nextProps) {
    this.props.firebase.off();
    this.loadRooms(nextProps);
  },

  _loadRooms(props) {
    props.firebase.on('value', snapshot => {
      if (!snapshot.val()) {
        props.firebase.set(DEFAULT_ROOM_LIST, (err) => {
          console.log(err);
        });
      } else {
        this.setState({
          loaded: true,
          rooms: snapshot.val(),
        });
      }
    });
  },

  _removeRoom() {
    // Removes room
  }

  _renderRoomsTable() {
    if (_.isEmpty(this.state.rooms)) {
      return '';
    }

    const tableStyle = {
      margin: '0 auto',
    };

    return (
      <h3>List of Rooms</h3>
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th>Room</th>
            <th>Delete</th>
          </tr>
        </tbody>
      </table>
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
