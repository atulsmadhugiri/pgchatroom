import alt from '../alt';
import Firebase from 'firebase';

import AdminActions from '../actions/AdminActions';
import { ROOT_URL, CONSTANTS_URL } from '../../constants';

const ROOT_FB = new Firebase(ROOT_URL);

class AdminStore {
  constructor() {
    this.bindActions(AdminActions);

    this.jsonToCsvSelected = false;
    this.auth = null;
    this.authError = null;
    this.selectedStudy = null;
    this.studies = null;
    this.fb = ROOT_FB;
    this.constantsFb = null;
  }

  selectJsonToCsv(selected) {
    this.jsonToCsvSelected = selected;
  }

  listenForStudies(studies) {
    this.studies = studies;
  }

  listenForAuth(auth) {
    this.auth = auth;
    this.authError = null;
  }

  setAuthError(authError) {
    this.authError = authError;
  }

  setSelectedStudy(study) {
    this.selectedStudy = study;
    this.constantsFb = new Firebase(`${CONSTANTS_URL}/${study}`);
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(AdminStore, 'AdminStore');
