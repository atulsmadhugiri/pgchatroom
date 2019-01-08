import React from 'react';
import Firebase from 'firebase';

import AdminActions from '../actions/AdminActions';

/**
 * This component authenticates through Firebase + Google OAuth.
 * See https://www.firebase.com/docs/web/guide/login/google.html for reference.
 */
const LoginButton = React.createClass({
  propTypes: {
    fb: React.PropTypes.object.isRequired,
    auth: React.PropTypes.object,
    authError: React.PropTypes.string,
  },

  componentWillMount() {
    AdminActions.listenForAuth();
  },

  _loginPopup() {
    const provider = new Firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.addScope('openid');
    Firebase.auth().signInWithPopup(provider).then(function(auth) {
      console.log(auth);
      AdminActions.listenForAuth();
    }).catch(function(error) {
      AdminActions.setAuthError(`${error.toString()} | Send Atul your UID: if you believe this is an error.`);
    });
  },

  _logout() {
    AdminActions.logout();
  },

  render() {
    return (<div>
      {this.props.auth ?
        <div className="logoutbutton" onClick={this._logout}>
          Log out
        </div>
        :
        <div className="button" onClick={this._loginPopup}>
          Log in through Google.
        </div>
      }

      <p>{this.props.authError}</p>
    </div>);
  },
});

export default LoginButton;
