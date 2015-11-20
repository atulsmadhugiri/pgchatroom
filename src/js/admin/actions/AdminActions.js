import alt from '../alt';

// import _ from 'underscore';

class AdminActions {
  constructor() {
    this.generateActions('setStudies');
  }
}

export default alt.createActions(AdminActions);
