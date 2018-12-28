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

// Don't swallow errors in promises
process.on('unhandledRejection', (error, promise) => {
  console.error('UNHANDLED REJECTION', error.stack);
});

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
    AdminStore.listen(this.onChange);
  }

  onChange() {
    this.setState(getStateFromStores());
  }

  toggleJsonState() {
    const { currState } = this.state;
    AdminActions.selectJsonToCsv(!{ currState }.jsonToCsvSelected);
  }

  renderStudySettings() {
    const { currState } = this.state;
    if (!{ currState }.selectedStudy) {
      return 'No Study Selected';
    }

    return (
      <div>
        <hr />
        <RoomsList
          roomsUrl={{ currState }.roomsUrl}
          study={{ currState }.selectedStudy}
        />
        <RoomGenerator selectedStudy={{ currState }.selectedStudy} />
        <ConfigSetter
          firebase={{ currState }.constantsFb}
          study={{ currState }.selectedStudy}
        />
      </div>
    );
  }

  render() {
    const { currState } = this.state;
    return (
      <div>
        <h1>Chat Room Admin Panel (test?)</h1>

        <LoginButton
          fb={{ currState }.fb}
          auth={{ currState }.auth}
          authError={{ currState }.authError}
        />

        {{ currState }.auth && { currState }.jsonToCsvSelected
        && (
        <div>
          // onKeyPress is solely to bypass the linter for now
          <div className="button" onClick={this.toggleJsonState}>
            Access admin panel
          </div>
          <JSONToCSVApp />
        </div>
        )}

        {{ currState }.auth && !{ currState }.jsonToCsvSelected
        && (
        <div>
          <div className="button" onClick={this.toggleJsonState}>
            Access chat data
          </div>

          <StudyList studies={{ currState }.studies} />

          <Spacer />

          {this.renderStudySettings()}
        </div>
        )}

        <Spacer />
      </div>
    );
  }
}

$(() => {
  ReactDOM.render(
    <AdminApp />,
    this.document.getElementById('admin-app'),
  );
});

export default AdminApp;
