import '../styles/chat.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './json_to_csv/configureStore';
import JSONToCSV from './json_to_csv/components';

const store = configureStore();

render(
  <Provider store={store}>
    <JSONToCSV />
  </Provider>,
  document.getElementById('json-to-csv-app')
);
