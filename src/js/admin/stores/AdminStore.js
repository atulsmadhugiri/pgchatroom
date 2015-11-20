import alt from '../alt';

import AdminActions from '../actions/AdminActions';

class AdminStore {
  constructor() {
    this.bindActions(AdminActions);

    this.selectedStudy = null;
    this.studies = null;
  }

  setStudies(studies) {
    this.studies = new Set(studies);
  }

  setSelectedStudy(study) {
    this.selectedStudy = study;
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(AdminStore, 'AdminStore');
