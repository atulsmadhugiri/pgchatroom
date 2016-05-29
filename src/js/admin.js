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

import AdminActions from './admin/actions/AdminActions';
import AdminStore from './admin/stores/AdminStore';

function getStateFromStores() {
  return {
    fb: AdminStore.get('fb'),
    auth: AdminStore.get('auth'),
    jsonToCsvSelected: AdminStore.get('jsonToCsvSelected'),
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

  _toggleJsonState() {
    AdminActions.selectJsonToCsv(!this.state.jsonToCsvSelected);
  },

  render() {
    if (!this.state.auth) {
      return <LoginButton fb={this.state.fb} />;
    }

    if (this.state.jsonToCsvSelected) {
      return (<div>
        <div className="button" onClick={this._toggleJsonState}>
          Access admin panel
        </div>
        <JSONToCSVApp />
      </div>);
    }

    return (
      <div>
        <h1>Chat Room Admin Panel</h1>

        <div className="button" onClick={this._toggleJsonState}>
          Access chat data
        </div>

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
