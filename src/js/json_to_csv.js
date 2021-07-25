import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './json_to_csv/configureStore';
import JSONToCSV from './json_to_csv/components';

const store = configureStore();

/**
 * This used to be its own page. Now we stick it under the admin section
 * because we want it to be auth'd.
 */
function JSONToCSVApp(props) {
  return (
    <Provider store={store}>
      <JSONToCSV {...props} />
    </Provider>
  );
}

export default JSONToCSVApp;
