import '../styles/chat.scss';

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import ConfigSetter from './admin/components/ConfigSetter';
import StudyList from './admin/components/StudyList';
import Spacer from './admin/components/Spacer';
import RoomGenerator from './admin/components/RoomGenerator';

import AdminStore from './admin/stores/AdminStore';

function getStateFromStores() {
  return {
    fb: AdminStore.get('fb'),
    auth: AdminStore.get('auth'),
    selectedStudy: AdminStore.get('selectedStudy'),
    studies: AdminStore.get('studies'),
    constantsFb: AdminStore.get('constantsFb'),
  };
}

/**
 * Stateful wrapper component for the admin page.
 */
const AdminApp = React.createClass({
  getInitialState() {
    return getStateFromStores();
  },

  componentWillMount() {
    AdminStore.listen(this._onChange);
  },

  _onChange() {
    this.setState(getStateFromStores());
  },

  render() {
    // if (!this.state.auth) {
    //   return <div>Need to log in.</div>;
    // }

    return (
      <div>
        <h1>Chat Room Admin Panel</h1>

        <a href="json_to_csv.html">
          Click here to access the chat room data instead.
        </a>

        <StudyList studies={this.state.studies} />

        <Spacer />

        {!this.state.selectedStudy ? 'No Study Selected' :
          <div>
            <hr />
            <RoomGenerator selectedStudy={this.state.selectedStudy} />
            <ConfigSetter firebase={this.state.constantsFb}
              study={this.state.selectedStudy} />
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
