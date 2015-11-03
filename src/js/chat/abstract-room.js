import Firebase from 'firebase';

import CHAT_CONSTANTS from './constants';

/**
 * AbstractRoom implements polling for user info
 * this.firebase - reference to firebase
 * this.usersFirebase - reference to subfirebase for users
 * this.users - object with user info
 * this.numUsers - number of users
 *
 * this.updateFromUser - abstract method to handle user update
 */
export default class AbstractRoom {
  constructor(roomType = 'abstract') {
    this.firebase = this.firebase || new Firebase(`${CHAT_CONSTANTS.BASE_URL}/${roomType}`);
    // this.users reflects firebase
    this.usersFirebase.on('value', snapshot => { this.users = snapshot.val() || {}; });
    this.pollUsers();
  }

  get numUsers() { return Object.keys(this.users).length; }
  get usersFirebase() { return this.firebase.child('users'); }

  updateFromUser() {
    throw new Error("Can't call abstract method");
  }

  addUser(userId) { this.usersFirebase.update({ [userId]: true }); }
  removeUser(userId) { this.usersFirebase.child(userId).remove(); }

  pollUsers() {
    CHAT_CONSTANTS.USERS_FIREBASE.on('child_added', this.updateFromUser.bind(this));
    CHAT_CONSTANTS.USERS_FIREBASE.on('child_changed', this.updateFromUser.bind(this));
    CHAT_CONSTANTS.USERS_FIREBASE.on('child_removed', snapshot => { this.removeUser(snapshot.key()); });
  }
}
