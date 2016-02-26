import _ from 'underscore';
import React from 'react';
import { connect } from 'react-redux';
import BabyParse from 'babyparse';

import { setStudyAndStartFetch } from './actions';

const USER_CSV_FIELDS = ['Room', 'Room ID', 'User ID'];

// Extracts Room,Room ID,User ID from JSON
const parseUserData = (json) => {
  const data = [];

  _.mapObject(json, (roomTypeData, roomType) => {
    _.mapObject(roomTypeData.rooms, (roomData, room) => {
      _.mapObject(roomData.users, (userVal, user) => {
        data.push([roomType, room, user]);
      });
    });
  });

  return data;
};

const userDataToCsv = (data) => {
  return BabyParse.unparse({ fields: USER_CSV_FIELDS, data: data });
};

const DataDisplay = ({ displayOption, data }) => {
  let csv;
  switch (displayOption) {
  case 'USERS':
    csv = userDataToCsv(parseUserData(data));
    break;
  case 'MESSAGES':
    csv = 'messages';
    break;
  default:
    csv = 'No data';
  }

  return <pre>{data && csv}</pre>;
};

const JSONToCSV = ({ study, displayOption, data, dispatch }) => {
  let studySelect;

  return (<div>
    <h1>Get Data from Study</h1>

    <form onSubmit={(e) => {
      e.preventDefault();
      dispatch(setStudyAndStartFetch(studySelect.value));
    }}>
      <select ref={node => studySelect = node}>
        <option value="ProjectA">Sam's study</option>
      </select>
      <br />
      <button name="submit">Submit</button>
    </form>

    <br />
    <DataDisplay displayOption={displayOption} data={data} />
  </div>);
};

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(JSONToCSV);
