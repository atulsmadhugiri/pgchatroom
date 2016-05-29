import React from 'react';

import AdminActions from '../actions/AdminActions';

/**
 * This component authenticates through Firebase + Google OAuth.
 * See https://www.firebase.com/docs/web/guide/login/google.html for reference.
 */
const LoginButton = React.createClass({
  propTypes: {
    fb: React.PropTypes.object.isRequired,
  },

  _loginPopup() {
    this.props.fb.authWithOAuthPopup('google', (err, auth) => {
      if (err) {
        console.log('Login failed!', err);
      } else {
        console.log('Logged in with payload:', auth);
        AdminActions.setAuth(auth);
      }
    });
  },

  render() {
    const styles = {
      width: '50%',
      margin: '10px auto',
      padding: 10,
      backgroundColor: '#D7D4FF',
      borderRadius: 5,
      cursor: 'pointer',
    };

    return (
      <div style={styles} onClick={this._loginPopup}>
        Log in through Google.
      </div>
    );
  },
});

export default LoginButton;
