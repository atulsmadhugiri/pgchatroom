import React from 'react';
import { connect } from 'react-redux';

import { setStudyAndStartFetch } from './actions';

const JSONToCSV = ({ study, displayOption, data, dispatch }) => {
  let studySelect;

  return (<div>
    <h1>Get Data from Study</h1>

    <form onSubmit={(e) => {
      e.preventDefault();
      dispatch(setStudyAndStartFetch(studySelect.value));
    }}>
      <select ref={node => studySelect = node}>
        <option value="sams_study">Sam's study</option>
      </select>
      <br />
      <button name="submit">Submit</button>
    </form>

    <pre></pre>
  </div>);
};

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(JSONToCSV);
