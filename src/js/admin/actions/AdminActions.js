import alt from '../alt';

class AdminActions {
  constructor() {
    this.generateActions('setSelectedStudy');
  }

  addStudy(study) {
    this.dispatch(study);
    this.actions.setSelectedStudy(study);
  }
}

export default alt.createActions(AdminActions);
