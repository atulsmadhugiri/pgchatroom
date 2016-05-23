import React from 'react';
import _ from 'underscore';

const RoomsList = React.createClass({

  getInitialState() {
    return {
      loaded: false,
      rooms: {},
    }
  },



  _renderTable() {
    return (
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th>Time (minutes)</th>
            <th>Message</th>
            <th>Type</th>
            <th>Delete</th>
          </tr>
          {this._renderRooms()}
        </tbody>
      </table>
    );
  },

  _renderRooms() {

  }

  render() {
    return (
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th>Time (minutes)</th>
            <th>Message</th>
            <th>Type</th>
            <th>Delete</th>
          </tr>
          {this._renderMessages()}
        </tbody>
      </table>
    );
  }

});

export default RoomsList;
