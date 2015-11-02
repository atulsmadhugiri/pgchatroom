import $ from 'jquery';
import Firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

import ConfigSetter from './components/admin/config-setter';
import UrlGenerator from './components/admin/url-generator';

// TODO(sam): Move this into the constants file
const CONFIG_FB = new Firebase('https://research-chat-room.firebaseio.com/constants');

export default class AdminApp extends React.Component {
  render() {
    return (
      <div>
        <h1>Chat Room Admin Panel</h1>

        <UrlGenerator />
        <hr />
        <ConfigSetter firebase={CONFIG_FB}/>
      </div>
    );
  }
}

$(() => {
  ReactDOM.render(
    <AdminApp />,
    document.getElementById('admin-app')
  );
});
