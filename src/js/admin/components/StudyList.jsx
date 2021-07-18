import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import AdminActions from '../actions/AdminActions';
import CreateStudy from './CreateStudy';
import Spacer from './Spacer';

/**
 * Renders a list of studies to choose from and edit.
 */
const StudyList = React.createClass({
  propTypes: {
    studies: PropTypes.array,
  },

  componentWillMount() {
    AdminActions.listenForStudies();
  },

  componentWillUnmount() {
    AdminActions.unlistenForStudies();
  },

  _renderStudies() {
    if (this.props.studies.length === 0) {
      return 'No studies yet.';
    }

    return this.props.studies.map((study) => (
      <div
        key={study}
        className="button"
        onClick={_.partial(this._handleSelectStudy, study)}
      >
        {study}
      </div>
    ));
  },

  _handleSelectStudy(study) {
    console.log(study);
    AdminActions.setSelectedStudy(study);
  },

  render() {
    if (!this.props.studies) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h3>
          List of Studies <br /> Click on one to modify its settings
        </h3>
        {this._renderStudies()}

        <Spacer />

        <CreateStudy studies={this.props.studies} />
      </div>
    );
  },
});

export default StudyList;
