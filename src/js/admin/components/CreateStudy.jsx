import React from 'react';
import _ from 'underscore';

import AdminActions from '../actions/AdminActions';

const ERROR_MESSAGE = 'This study already exists.';

const CreateStudy = React.createClass({
  propTypes: {
    studies: React.PropTypes.array.isRequired,
  },

  getInitialState() {
    return {
      study: '',
    };
  },

  _handleChange(e) {
    this.setState({ study: e.target.value });
  },

  _handleSubmit(e) {
    e.preventDefault();
    if (this._isInvalid()) {
      throw new Error('Tried to create an invalid study name');
    }

    AdminActions.addStudy(this.state.study);
    this.setState({ study: '' });
  },

  _isInvalid() {
    return !this.state.study || this.state.study.indexOf(' ') >= 0 ||
      this._studyExists();
  },

  _studyExists() {
    return _.contains(this.props.studies, this.state.study);
  },

  render() {
    console.log(this._isInvalid());
    return (
      <form onSubmit={this._handleSubmit}>
        <div>
          <label htmlFor="createStudy">Create a new study</label>
          <input ref="studyInput"
            type="text"
            id="createStudy"
            placeholder="Study name"
            value={this.state.study}
            onChange={this._handleChange} />
        </div>

        {this._studyExists() && <h3>{ERROR_MESSAGE}</h3>}

        <button name="submit" disabled={this._isInvalid()}>Create</button>
      </form>
    );
  },
});

export default CreateStudy;
