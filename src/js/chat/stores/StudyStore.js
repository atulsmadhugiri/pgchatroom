import alt from '../alt';
import Firebase from 'firebase';

import StudyActions from '../actions/StudyActions';

const BASE_URL = `https://research-chat-room.firebaseio.com`;
// const BASE_URL = `ws://127.0.1:5000`;

class StudyStore {
  constructor() {
    this.bindActions(StudyActions);

    this.study = null;
    this.baseFb = null;
    this.configFb = null;
    this.config = null;
  }

  onInitStudy(study) {
    this.study = study;

    this.baseFb = new Firebase(`${BASE_URL}/${this.study}`);
    this.configFb = new Firebase(`${BASE_URL}/constants`);
    this.usersFb = this.baseFb.child('users');
    this.roomsFb = this.baseFb.child('rooms');
  }

  onUpdateConfig(config) {
    this.config = config;
  }

  static getStudy() {
    return this.getState().study;
  }

  static getConfig() {
    return this.getState().config;
  }

  static getBaseFb() {
    return this.getState().baseFb;
  }

  static getConfigFb() {
    return this.getState().configFb;
  }

  static getUsersFb() {
    return this.getState().usersFb;
  }

  static getRoomsFb() {
    return this.getState().roomsFb;
  }
}

export default alt.createStore(StudyStore, 'StudyStore');
