import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import firebase from 'firebase';
// import $ from 'jquery';
import { ROOT_URL } from '../../constants';

function deleteMessage(object) {
  return `Are you sure you want to delete this ${object}? This cannot be undone.`;
}

class RoomsList extends React.Component {
  getInitialState() {
    return {
      loaded: false,
      rooms: {},
    };
  }

  componentDidMount() {
    this.loadRooms(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadRooms(nextProps);
  }

  loadRooms(props) {
    if (!_.isUndefined(props.roomsUrl)) {
      props.roomsUrl.on('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({ rooms: snapshot.val() });
        }
      });
      // $.get(props.roomsUrl).done((result) => {
      //   if (!_.isEmpty(result)) {
      //     this.setState({ rooms: result });
      //   }
      // });
    }
  }

  removeRoom(e) {
    const confirmDelete = this.window.confirm(deleteMessage('room'));
    const room = e.target.parentElement.id;
    if (confirmDelete) {
      const roomFb = new firebase(`${ROOT_URL}/${this.props.study}/${room}`);
      roomFb.remove(() => {
        const rooms = this.state.rooms;
        delete rooms[room];
        this.setState({ rooms });
      });
    }
  }

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
            {this.renderRooms()}
          </tbody>
        </table>
      </div>
    );
  }

  _renderRooms() {
    const xStyle = {
      cursor: 'pointer',
    };

    return _.keys(this.state.rooms).map(key => (
      <tr key={key} id={key}>
        <td>{key}</td>
        <td style={xStyle} onClick={this.removeRoom}>&times;</td>
      </tr>
    ));
  }

  render() {
    return <div>{this.renderRoomsTable()}</div>;
  }
}

RoomsList.propTypes = {
  // roomsUrl: React.PropTypes.string,
  roomsUrl: PropTypes.object.isRequired,
  study: PropTypes.string.isRequired,
};

export default RoomsList;
