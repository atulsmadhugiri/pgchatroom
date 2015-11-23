import alt from '../alt';

class AdminActions {
  constructor() {
    this.generateActions('addStudy', 'setSelectedStudy');
  }
}

export default alt.createActions(AdminActions);
