import firebase from 'firebase';

import alt from '../alt';
import { API_KEY, AUTH_DOMAIN, ROOT_URL } from '../../constants';

const config = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: ROOT_URL,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const ROOT_FB = firebase.database().ref();
const STUDIES_FB = firebase.database().ref('/studies');

class AdminActions {
  constructor() {
    this.generateActions('selectJsonToCsv',
      'setSelectedStudy');
  }

  // No unlisten method cause we shouldn't have to unlisten on this page
  // This only allows admins to auth through
  listenForAuth() {
    ROOT_FB.onAuth((auth) => {
      ROOT_FB.child('admins').once('value', () => this.dispatch(auth),
        err => this.actions.setAuthError(`${err.toString()} | Send Sam
          your UID: ${auth.uid} if you believe this is an error.`));
    });
  }

  setAuthError(err) {
    this.dispatch(err.toString());
  }

  logout() {
    this.ROOT_FB.unauth();
  }

  listenForStudies() {
    STUDIES_FB.on('value', (snapshot) => {
      const studies = snapshot.val() || [];
      this.dispatch(studies);
    });
  }

  unlistenForStudies() {
    this.STUDIES_FB.off();
  }

  setStudies(studies) {
    this.STUDIES_FB.set(studies);
  }
}

export default alt.createActions(AdminActions);
