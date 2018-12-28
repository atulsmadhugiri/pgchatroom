import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import AdminActions from '../actions/AdminActions';

const ERROR_MESSAGE = 'This study already exists.';

/**
 * Presentational component that renders a form to create a study.
 */
class CreateStudy extends React.Component {
  getInitialState() {
    return {
      study: '',
    };
  }

  handleChange(e) {
    this.setState({ study: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.isInvalid()) {
      throw new Error('Tried to create an invalid study name');
    }

    const newStudy = this.state.study;
    const newStudies = this.props.studies.concat([newStudy]);
    AdminActions.setStudies(newStudies);
    AdminActions.setSelectedStudy(newStudy);

    // Clear input
    this.setState({ study: '' });
  }

  isInvalid() {
    return !this.state.study || this.state.study.indexOf(' ') >= 0
      || this.studyExists();
  }

  studyExists() {
    return _.contains(this.props.studies, this.state.study);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="createStudy">Create a new study</label>
          <input
            ref="studyInput"
            type="text"
            id="createStudy"
            placeholder="Study name"
            value={this.state.study}
            onChange={this.handleChange}
          />
        </div>

        {this.studyExists() && <h3>{ERROR_MESSAGE}</h3>}

        <button name="submit" disabled={this.isInvalid()}>Create</button>
      </form>
    );
  }
}

CreateStudy.propTypes = {
  studies: PropTypes.array.isRequired,
};

export default CreateStudy;
