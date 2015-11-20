import alt from '../alt';

// import _ from 'underscore';

class AdminActions {
  constructor() {
    this.generateActions('setStudies', 'setSelectedStudy');
  }
}

export default alt.createActions(AdminActions);
