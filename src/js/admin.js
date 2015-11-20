import $ from 'jquery';
import Firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

import ConfigSetter from './admin/components/config-setter';
import StudyList from './admin/components/StudyList';

import AdminStore from './admin/stores/AdminStore';


// TODO(sam): Move this into the constants file
const STUDIES_FB = new Firebase('https://research-chat-room.firebaseio.com/studies');
const CONSTANTS_URL = 'https://research-chat-room.firebaseio.com/constants/';
const USER_ID_FIELD = 'user_id=${e://Field/CHATROOM%20ID}';

function getStateFromStores() {
  return {
    selectedStudy: AdminStore.get('selectedStudy'),
  };
}

const AdminApp = React.createClass({
  getInitialState() {
    return {
      ...getStateFromStores(),
    };
  },

  componentWillMount() {
    AdminStore.listen(this._onChange);
  },

  _onChange() {
    this.setState(getStateFromStores());
  },

  _getFireBaseFromStudy() {
    return new Firebase(`${CONSTANTS_URL}${this.state.selectedStudy}`);
  },

  _getChatRoomUrl() {
    return `https://samlau95.github.io/pg-chat-room?study=` +
      `${this.state.selectedStudy}&${USER_ID_FIELD}`;
  },

  render() {
    return (
      <div>
        <div>
          <StudyList firebase={STUDIES_FB} />
        </div>
        {!this.state.selectedStudy ? 'No Study Selected' :
          <div>
            <h1>Chat Room Admin Panel for {`${this.state.selectedStudy}`}</h1>

            <h3>URL for study</h3>
            <div>{this._getChatRoomUrl()}</div>

            <hr />
            <ConfigSetter firebase={this._getFireBaseFromStudy()} />
          </div>
        }
      </div>
    );
  },
});

$(() => {
  ReactDOM.render(
    <AdminApp />,
    document.getElementById('admin-app')
  );
});

export default AdminApp;
