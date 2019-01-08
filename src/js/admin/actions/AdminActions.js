import alt from '../alt';
import Firebase from 'firebase';

// const config = {
//   apiKey: API_KEY,
//   authDomain: AUTH_DOMAIN,
//   databaseURL: ROOT_URL,
// };
// Firebase.initializeApp(config);
const ROOT_FB = Firebase.database().ref();
const STUDIES_FB = Firebase.database().ref('studies');

class AdminActions {
  constructor() {
    this.generateActions('selectJsonToCsv',
      'setSelectedStudy');
  }

  // No unlisten method cause we shouldn't have to unlisten on this page
  // This only allows admins to auth through
  listenForAuth() {
    // ROOT_FB.onAuth((auth) => {
    //   ROOT_FB.child('admins').once('value',
    //     () => this.dispatch(auth),
    //     (err) => this.actions.setAuthError(`${err.toString()} | Send Sam
    //       your UID: ${auth.uid} if you believe this is an error.`),
    //   );
    // });
    return Firebase.auth().currentUser;
    // return 'hello';
    // Firebase.auth().onAuthStateChanged(function(auth) {
    //   if (auth) {
    //     ROOT_FB.child('admins').once('value',
    //     () => {
    //       return auth;
    //     },
    //     (err) => this.actions.setAuthError(`${err.toString()} | Send Sam
    //       your UID: ${auth.uid} if you believe this is an error.`),
    //   );
    //   }
    // });
  }

  setAuthError(err) {
    return err.toString();
  }

  logout() {
    ROOT_FB.unauth();
  }

  listenForStudies() {
    console.log('was hit');
    STUDIES_FB.on('value', snapshot => {
      const studies = snapshot.val() || [];
      console.log(studies);
      this.dispatch(studies);
    });
  }

  unlistenForStudies() {
    STUDIES_FB.off();
  }

  setStudies(studies) {
    STUDIES_FB.set(studies);
  }
}

export default alt.createActions(AdminActions);
