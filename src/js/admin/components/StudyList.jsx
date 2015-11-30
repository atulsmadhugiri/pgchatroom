import React from 'react';
import _ from 'underscore';

import AdminActions from '../actions/AdminActions';
import CreateStudy from './CreateStudy';
import Spacer from './Spacer';

const StudyList = React.createClass({
  propTypes: {
    studies: React.PropTypes.array.isRequired,
  },

  _renderStudies() {
    if (this.props.studies.length === 0) {
      return 'No studies yet.';
    }

    const studyStyles = {
      width: '50%',
      margin: '10px auto',
      padding: 10,
      backgroundColor: '#D7D4FF',
      borderRadius: 5,
    };

    return this.props.studies.map(study => (
      <div key={study}
           style={studyStyles}
           onClick={_.partial(this._handleSelectStudy, study)}>
        {study}
      </div>)
    );
  },

  _handleSelectStudy(study) {
    console.log(study);
    AdminActions.setSelectedStudy(study);
  },

  render() {
    return (
      <div>
        <h3>List of Studies <br/> Click on one to modify its settings</h3>
        {this._renderStudies()}

        <Spacer />

        <CreateStudy studies={this.props.studies} />
      </div>
    );
  },
});

export default StudyList;
