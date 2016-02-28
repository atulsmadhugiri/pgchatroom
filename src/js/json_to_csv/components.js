import _ from 'underscore';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import BabyParse from 'babyparse';

import { setStudyAndStartFetch, setDisplayOption } from './actions';

const dataShape = PropTypes.objectOf(PropTypes.shape({
  rooms: PropTypes.objectOf(PropTypes.shape({
    createdAt: PropTypes.number.isRequired,
    messages: PropTypes.objectOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    })).isRequired,
  })),
  users: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
}));

// Extracts Room,Room ID,User ID from data
function extractUserData(data) {
  const USER_CSV_FIELDS = ['Room', 'Room ID', 'User ID'];
  const csvData = [];

  _.mapObject(data, (roomTypeData, roomType) => {
    _.mapObject(roomTypeData.rooms, (roomData, room) => {
      _.mapObject(roomData.users, (userVal, user) => {
        csvData.push([roomType, room, user]);
      });
    });
  });

  return BabyParse.unparse({ fields: USER_CSV_FIELDS, data: csvData });
}

// Extracts Room ID,User ID,Message from data
function extractMessageData(data) {
  const MESSAGES_CSV_FIELDS = ['Room ID', 'User ID', 'Message'];
  const csvData = [];

  _.mapObject(data, (roomTypeData, roomType) => {
    _.mapObject(roomTypeData.rooms, (roomData, room) => {
      _.each(roomData.messages, ({ message, userId }) => {
        csvData.push([room, userId, message]);
      });
    });
  });

  return BabyParse.unparse({ fields: MESSAGES_CSV_FIELDS, data: csvData });
}

const DataDisplay = ({ displayOption, data }) => {
  let csv;
  switch (displayOption) {
  case 'USERS':
    csv = extractUserData(data);
    break;
  case 'MESSAGES':
    csv = extractMessageData(data);
    break;
  default:
    csv = 'No data available for this study.';
  }

  return <pre>{csv}</pre>;
};

DataDisplay.propTypes = {
  displayOption: PropTypes.string.isRequired,
  data: dataShape.isRequired,
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
    {data && <form>
      <input type="radio" value="USERS"
        id="users"
        checked={displayOption === 'USERS'}
        onChange={(e) => dispatch(setDisplayOption(e.target.value))} />
      <label style={{display: 'inline'}} htmlFor="users">Users</label>
      <input type="radio" value="MESSAGES"
        id="messages"
        checked={displayOption === 'MESSAGES'}
        onChange={(e) => dispatch(setDisplayOption(e.target.value))} />
      <label style={{display: 'inline'}} htmlFor="messages">Messages</label>
    </form>}

    {data && <DataDisplay displayOption={displayOption} data={data} />}
  </div>);
};

JSONToCSV.propTypes = {
  study: PropTypes.string.isRequired,
  displayOption: PropTypes.string.isRequired,
  data: dataShape,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(JSONToCSV);
