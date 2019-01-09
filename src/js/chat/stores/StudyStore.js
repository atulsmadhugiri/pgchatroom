import alt from '../alt';
import Firebase from 'firebase';

import StudyActions from '../actions/StudyActions';
// import { ROOT_URL, USER_AUTH_URL } from '../../constants';
import { ROOT_URL, API_KEY, AUTH_DOMAIN } from '../../constants';

class StudyStore {
  constructor() {
    this.bindActions(StudyActions);
    this.study = null;
    this.room = null;
    this.config = null;

    this.usersFb = null;
    this.roomsFb = null;
    this.baseFb = null;
    this.configFb = null;
    this.userAuthFb = null;
  }

  initStudy({ study, room }) {
    this.study = study;
    this.room = room;
    const fbinit = {
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      databaseURL: ROOT_URL,
    };
    Firebase.initializeApp(fbinit);
    this.baseFb = Firebase.database().ref('/' + this.study + '/' + this.room);
    // this.baseFb = new Firebase(`${ROOT_URL}/${this.study}/${this.room}`);
    // this.configFb = new Firebase(`${ROOT_URL}/constants/${this.study}`);
    this.configFb = Firebase.database().ref('/constants/' + this.study);
    // FIXME - authURL correct?
    // this.userAuthFb = new Firebase(USER_AUTH_URL);
    this.userAuthFb = Firebase.database().ref('user_auth');
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
