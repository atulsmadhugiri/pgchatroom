import $ from 'jquery';
import Firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

import ConfigSetter from './admin/components/config-setter';
import UrlGenerator from './admin/components/url-generator';
import StudyList from './admin/components/StudyList';

import AdminStore from './admin/stores/AdminStore';


// TODO(sam): Move this into the constants file
const CONFIG_FB = new Firebase('https://research-chat-room.firebaseio.com/constants');
const STUDIES_FB = new Firebase('https://research-chat-room.firebaseio.com/studies');

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

  render() {
    return (
      <div>
        <div>
          <StudyList firebase={STUDIES_FB} />
        </div>
        {!this.state.selectedStudy ? 'No Study Selected' :
          <div>
            <h1>Chat Room Admin Panel</h1>
            <UrlGenerator />
            <hr />
            <ConfigSetter firebase={CONFIG_FB} />
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
