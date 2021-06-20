import React from 'react';
import PropTypes from 'prop-types';

class Message extends React.Component {
  static get propTypes() {
    return {
      userId: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    };
  }
  render() {
    return (
      <div className="row">
        <div className="user">{this.props.userId}</div>
        <div className="message">{this.props.message}</div>
      </div>
    );
  }
}

export default Message;
