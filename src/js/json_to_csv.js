import '../styles/chat.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './json_to_csv/configureStore';
import JSONToCSV from './json_to_csv/components';
// import BabyParse from 'babyparse';


// const CSV_FIELDS = ['Room', 'Room ID', 'User ID'];

// // Extracts Room,Room ID,User ID from JSON
// const parseData = (text) => {
//   const json = JSON.parse(text);
//   const data = [];

//   _.mapObject(json, (roomTypeData, roomType) => {
//     _.mapObject(roomTypeData.rooms, (roomData, room) => {
//       _.mapObject(roomData.users, (userVal, user) => {
//         data.push([roomType, room, user]);
//       });
//     });
//   });

//   return data;
// };

// const dataToCsv = (data) => {
//   return BabyParse.unparse({ fields: CSV_FIELDS, data: data });
// };

const store = configureStore();

render(
  <Provider store={store}>
    <JSONToCSV />
  </Provider>,
  document.getElementById('json-to-csv-app')
);
