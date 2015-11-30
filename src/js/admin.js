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
    selectedStudy: AdminStore.get('selectedStudy'),
    studies: AdminStore.get('studies'),
    constantsFb: AdminStore.get('constantsFb'),
  };
}

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
    console.log(this.state);
    if (!this.state.studies) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h1>Chat Room Admin Panel</h1>

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
