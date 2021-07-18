import React from 'react';
import PropTypes from 'prop-types';

import AdminActions from '../actions/AdminActions';

/**
 * This component authenticates through Firebase + Google OAuth.
 * See https://www.firebase.com/docs/web/guide/login/google.html for reference.
 */
const LoginButton = React.createClass({
  propTypes: {
    fb: PropTypes.object.isRequired,
    auth: PropTypes.object,
    authError: PropTypes.string,
  },

  componentWillMount() {
    AdminActions.listenForAuth();
  },

  _loginPopup() {
    this.props.fb.authWithOAuthPopup('google', (err, auth) => {
      if (err) {
        AdminActions.setAuthError(`${err.toString()} | Send Sam your UID:
          ${auth.uid} if you believe this is an error.`);
      } else {
        // We're listening to auth so the store will get the new value
      }
    });
  },

  _logout() {
    AdminActions.logout();
  },

  render() {
    return (
      <div>
        {this.props.auth ? (
          <div className="button" onClick={this._logout}>
            Log out
          </div>
        ) : (
          <div className="button" onClick={this._loginPopup}>
            Log in through Google.
          </div>
        )}

        <p>{this.props.authError}</p>
      </div>
    );
  },
});

export default LoginButton;
