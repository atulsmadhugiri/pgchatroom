import alt from '../alt';
import Firebase from 'firebase';

import { STUDIES_URL } from '../../constants';

const STUDIES_FB = new Firebase(STUDIES_URL);

class AdminActions {
  constructor() {
    this.generateActions('setAuth', 'setSelectedStudy');
  }

  listenForStudies() {
    STUDIES_FB.on('value', snapshot => {
      const studies = snapshot.val() || [];
      this.dispatch(studies);
    });
  }

  setStudies(studies) {
    STUDIES_FB.set(studies);
    this.dispatch(studies);
  }
}

export default alt.createActions(AdminActions);
