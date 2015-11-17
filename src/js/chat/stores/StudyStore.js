import alt from '../alt';
import Firebase from 'firebase';

import StudyActions from '../actions/StudyActions';
import { ROOT_URL } from '../constants';

class StudyStore {
  constructor() {
    this.bindActions(StudyActions);

    this.study = null;
    this.config = null;

    this.usersFb = null;
    this.roomsFb = null;
    this.baseFb = null;
    this.configFb = null;
  }

  initStudy(study) {
    this.study = study;

    this.baseFb = new Firebase(`${ROOT_URL}/${this.study}`);
    this.configFb = new Firebase(`${ROOT_URL}/constants`);
    this.usersFb = this.baseFb.child('users');
    this.roomsFb = this.baseFb.child('rooms');
  }

  updateConfig(config) {
    this.config = config;
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(StudyStore, 'StudyStore');
