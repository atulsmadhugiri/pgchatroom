import React from 'react';
import PropTypes from 'prop-types';

class Message extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="user">{this.props.userId}</div>
        <div className="message">{this.props.message}</div>
      </div>
    );
  }
}

Message.propTypes = {
  userId: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Message;
