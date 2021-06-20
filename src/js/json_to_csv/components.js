import _ from 'underscore';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PapaParse from 'papaparse';

import {
  fetchStudyList,
  setStudyAndStartFetch,
  setDisplayOption,
} from './actions';

const dataShape = PropTypes.objectOf(
  PropTypes.shape({
    rooms: PropTypes.objectOf(
      PropTypes.shape({
        createdAt: PropTypes.number.isRequired,
        messages: PropTypes.objectOf(
          PropTypes.shape({
            message: PropTypes.string.isRequired,
            userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
              .isRequired,
          })
        ),
      })
    ),
    users: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  })
);

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

  return PapaParse.unparse({ fields: USER_CSV_FIELDS, data: csvData });
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

  return PapaParse.unparse({ fields: MESSAGES_CSV_FIELDS, data: csvData });
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

class JSONToCSV extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchStudyList());
  }

  render() {
    const { studyList, displayOption, data, dispatch, error } = this.props;

    let studySelect;

    return (
      <div>
        <h1>Get Data from Study</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(setStudyAndStartFetch(studySelect.value));
          }}
        >
          <select ref={(node) => (studySelect = node)}>
            {_.map(studyList, (s) => (
              <option value={s} key={s}>
                {s}
              </option>
            ))}
          </select>
          <br />
          <button name="submit">Submit</button>
        </form>

        <br />
        {error}

        {data && (
          <form>
            <input
              type="radio"
              value="USERS"
              id="users"
              checked={displayOption === 'USERS'}
              onChange={(e) => dispatch(setDisplayOption(e.target.value))}
            />
            <label style={{ display: 'inline' }} htmlFor="users">
              Users
            </label>
            <input
              type="radio"
              value="MESSAGES"
              id="messages"
              checked={displayOption === 'MESSAGES'}
              onChange={(e) => dispatch(setDisplayOption(e.target.value))}
            />
            <label style={{ display: 'inline' }} htmlFor="messages">
              Messages
            </label>
          </form>
        )}

        {data && <DataDisplay displayOption={displayOption} data={data} />}
      </div>
    );
  }
}

JSONToCSV.propTypes = {
  studyList: PropTypes.array.isRequired,
  study: PropTypes.string.isRequired,
  displayOption: PropTypes.string.isRequired,
  data: dataShape,
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
};

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(JSONToCSV);
