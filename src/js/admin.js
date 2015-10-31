import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import UrlGenerator from './components/url-generator';

export default class AdminApp extends React.Component {
  render() {
    return (
      <div>
        <h1>Chat Room Admin Panel</h1>

        <UrlGenerator />
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
