import React from 'react';

const USER_ID_FIELD = 'user_id=${e://Field/CHATROOM%20ID}';

const nameToUrl = (roomName) => {
  return `https://samlau95.github.io/pg-chat-room?` +
    `study=${roomName}&${USER_ID_FIELD}`;
};

const UrlGenerator = React.createClass({
  getInitialState() {
    return { name: '', url: '' };
  },

  _handleChange(e) {
    this.setState({ name: e.target.value });
  },

  _handleSubmit(e) {
    e.preventDefault();
    this.setState({ url: nameToUrl(this.state.name) });
  },

  render() {
    const inputStyle = {
      display: 'block',
      margin: '0 auto',
    };

    return (
      <div>
        <form onSubmit={this._handleSubmit}>
          <h3>Generate a chatroom URL for a given study.</h3>

          <input type="text"
            value={this.state.name}
            onChange={this._handleChange}
            style={inputStyle}
            placeholder="Study name" />

          <button name="submit">Generate</button>
        </form>

        <div>{this.state.url}</div>
      </div>
    );
  },
});

export default UrlGenerator;
