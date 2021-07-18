import '../styles/chat.scss';

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import JSONToCSVApp from './json_to_csv';

import LoginButton from './admin/components/LoginButton';
import ConfigSetter from './admin/components/ConfigSetter';
import StudyList from './admin/components/StudyList';
import Spacer from './admin/components/Spacer';
import RoomGenerator from './admin/components/RoomGenerator';
import RoomsList from './admin/components/RoomsList';

import AdminActions from './admin/actions/AdminActions';
import AdminStore from './admin/stores/AdminStore';

function getStateFromStores() {
  return {
    fb: AdminStore.get('fb'),
    auth: AdminStore.get('auth'),
    authError: AdminStore.get('authError'),
    jsonToCsvSelected: AdminStore.get('jsonToCsvSelected'),
    selectedStudy: AdminStore.get('selectedStudy'),
    studies: AdminStore.get('studies'),
    constantsFb: AdminStore.get('constantsFb'),
    roomsUrl: AdminStore.get('roomsUrl'),
  };
}

/**
 * Stateful wrapper component for the admin page.
 */
class AdminApp extends React.Component {
  getInitialState() {
    return getStateFromStores();
  }

  componentWillMount() {
    AdminStore.listen(this._onChange);
  }

  _onChange() {
    this.setState(getStateFromStores());
  }

  _toggleJsonState() {
    AdminActions.selectJsonToCsv(!this.state.jsonToCsvSelected);
  }

  _renderStudySettings() {
    if (!this.state.selectedStudy) {
      return 'No Study Selected';
    }

    return (
      <div>
        <hr />
        <RoomsList
          roomsUrl={this.state.roomsUrl}
          study={this.state.selectedStudy}
        />
        <RoomGenerator selectedStudy={this.state.selectedStudy} />
        <ConfigSetter
          firebase={this.state.constantsFb}
          study={this.state.selectedStudy}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Chat Room Admin Panel</h1>

        <LoginButton
          fb={this.state.fb}
          auth={this.state.auth}
          authError={this.state.authError}
        />

        {this.state.auth && this.state.jsonToCsvSelected && (
          <div>
            <div className="button" onClick={this._toggleJsonState}>
              Access admin panel
            </div>
            <JSONToCSVApp />
          </div>
        )}

        {this.state.auth && !this.state.jsonToCsvSelected && (
          <div>
            <div className="button" onClick={this._toggleJsonState}>
              Access chat data
            </div>

            <StudyList studies={this.state.studies} />

            <Spacer />

            {this._renderStudySettings()}
          </div>
        )}

        <Spacer />
      </div>
    );
  }
}

$(() => {
  ReactDOM.render(<AdminApp />, document.getElementById('admin-app'));
});

export default AdminApp;
