import React from 'react';

import AdminStore from '../stores/AdminStore';
import CreateStudy from './CreateStudy';

import AdminActions from '../actions/AdminActions';

function getStateFromStores() {
  return {
    studies: AdminStore.get('studies'),
  };
}

const StudyList = React.createClass({
  propTypes: {
    firebase: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      ...getStateFromStores(),
      loaded: false,
    };
  },

  componentWillMount() {
    this.props.firebase.on('value', snapshot => {
      if (!snapshot.val()) {
        this.props.firebase.set({ studies: new Set() }, (err) => {
          this.setState({ loaded: true });
          console.log(err);
        });
      } else {
        this.setState({ loaded: true });
        const studies = snapshot.val().studies;
        if (studies) {
          AdminActions.setStudies(studies);
        }
      }
    });

    AdminStore.listen(this._onChange);
  },

  _onChange() {
    this.setState(getStateFromStores());
  },

  _renderStudies() {
    if (!this.state.loaded || !this.state.studies) {
      return 'Loading';
    }

    if (!this.state.studies.size) {
      return 'No Studies here!';
    }

    return [...this.state.studies].map(study => {
      return <div key={study} onClick={this._handleSelectStudy}>{study}</div>;
    });
  },

  _handleSelectStudy(e) {
    const study = e.target.innerHTML;
    console.log(study);
    AdminActions.setSelectedStudy(study);
  },

  render() {
    return (
      <div>
        <h3>List of Studies - Click on one to modify the settings</h3>
        {this._renderStudies()}
        <CreateStudy {...this.props} studies={this.state.studies} />
      </div>
    );
  },
});

export default StudyList;
