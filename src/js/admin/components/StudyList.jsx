import React from 'react';
import _ from 'underscore';
import PropTypes from 'prop-types';

import AdminActions from '../actions/AdminActions';
import CreateStudy from './CreateStudy';
import Spacer from './Spacer';

/**
 * Renders a list of studies to choose from and edit.
 */
class StudyList extends React.Component {
  componentWillMount() {
    AdminActions.listenForStudies();
  }

  componentWillUnmount() {
    AdminActions.unlistenForStudies();
  }

  handleSelectStudy(study) {
    console.log(study);
    AdminActions.setSelectedStudy(study);
  }

  renderStudies() {
    if (this.props.studies.length === 0) {
      return 'No studies yet.';
    }

    return this.props.studies.map(study => (
      <div
        key={study}
        className="button"
        onClick={_.partial(this.handleSelectStudy, study)}
      >
        {study}
      </div>));
  }

  render() {
    if (!this.props.studies) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h3>
          List of Studies
          <br />
          {' '}
        Click on one to modify its settings
        </h3>
        {this.renderStudies()}

        <Spacer />

        <CreateStudy studies={this.props.studies} />
      </div>
    );
  }
}

StudyList.propTypes = {
  studies: PropTypes.array.isRequired,
};

export default StudyList;
