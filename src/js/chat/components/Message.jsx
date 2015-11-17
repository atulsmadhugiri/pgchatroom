import React from 'react';

const Message = React.createClass({
  propTypes: {
    userId: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
  },

  render() {
    return (
      <div className="row">
        <div className="user">{this.props.userId}</div>
        <div className="message">{this.props.message}</div>
      </div>
    );
  },
});

export default Message;
