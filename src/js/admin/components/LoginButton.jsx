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

  getInitialState() {
    return { error: '' };
  },

  _loginPopup() {
    const setError = (error) => this.setState({ error: error.toString() });

    this.props.fb.authWithOAuthPopup('google', (err, auth) => {
      if (err) {
        setError(err);
      } else {
        this.props.fb.child('admins').once('value',
          (snapshot) => AdminActions.setAuth(auth),
          setError,
        );
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

    return (<div>
        <div style={styles} onClick={this._loginPopup}>
          Log in through Google.
        </div>

        <p>{this.state.error}</p>
      </div>
    );
  },
});

export default LoginButton;
