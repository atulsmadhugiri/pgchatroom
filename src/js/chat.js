import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import ChatApp from './chat/components/ChatApp';

$(() => {
  ReactDOM.render(
    <ChatApp />,
    document.getElementById('chat-app')
  );
});
