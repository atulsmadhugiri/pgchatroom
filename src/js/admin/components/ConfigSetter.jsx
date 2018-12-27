/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import { convertToMs, convertToMins } from '../../chat/util';
import { DEFAULT_ROOM_VALUES, MESSAGE_TYPES } from '../../constants';

/**
 * This is a standalone component that manages its own state (no flux).
 * It allows for editing of a study's settings.
 */
class ConfigSetter extends React.Component {
  getInitialState() {
    return {
      loaded: false, // loaded data from Firebase yet?
      saved: false, // saved back to Firebase yet?
      messageObject: {
        message: '',
        type: MESSAGE_TYPES.system,
        id: 111,
      },
      messageError: '',
      messageTime: '',
      messageTimeError: '',
      messageIDError: '',
      // All attributes default to false
      config: {
        usersPerRoom: false,
        maxWaitingTime: false,
        roomOpenTime: false,
        password: false,
        altPassword: false,
        messages: false,
      },
    };
  }

  componentWillMount() {
    // Only read in initial data
    this.loadConfig(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.props.firebase.off();
    this.loadConfig(nextProps);
  }

  loadConfig(props) {
    props.firebase.on('value', (snapshot) => {
      if (!snapshot.val()) {
        props.firebase.set(DEFAULT_ROOM_VALUES, (err) => {
          console.log(err);
        });
      } else {
        this.setState({
          loaded: true,
          config: snapshot.val(),
        });
      }
    });
  }

  handleConfigSubmit(e) {
    e.preventDefault();
    this.props.firebase.set(this.state.config, (err) => {
      this.setState({ saved: !err });
    });
  }

  // transform arg is used to change from mins to ms
  handleChange(attr, transform = _.identity, e) {
    const config = _.extend({}, this.state.config, {
      [attr]: transform(e.target.value),
    });

    this.setState({
      saved: false,
      config,
    });
  }

  formGeneralInput(attr, label, convertData = _.identity,
    convertInput = _.identity) {
    return (
      <div>
        <label htmlFor={attr}>{label}</label>
        <input
          type="text"
          id={attr}
          value={convertData(this.state.config[attr])}
          onChange={_.partial(this.handleChange, attr, convertInput)}
        />
        <div className="spacer" />
      </div>
    );
  }

  handleMessageSubmit(e) {
    e.preventDefault();

    if (this.hasValidMessage()) {
      const config = this.state.config;
      if (_.isUndefined(config.messages)) {
        config.messages = {};
      }

      config.messages[convertToMs(parseFloat(this.state.messageTime))] = this.state.messageObject;

      this.props.firebase.set(config, (err) => {
        this.setState({
          messageObject: {
            message: '',
            type: MESSAGE_TYPES.system,
            id: 111,
          },
          messageError: '',
          messageTime: '',
          messageTimeError: '',
          messageIDError: '',
          config,
        });
        console.log(this.state);
      });
    }
  }

  hasValidMessage() {
    let valid = true;

    if (_.isEmpty(this.state.messageObject.message)) {
      this.setState({ messageError: 'Empty Message' });
      valid = false;
    }

    if (_.isNaN(parseFloat(this.state.messageTime))) {
      this.setState({ messageTimeError: 'Invalid Time' });
      valid = false;
    }

    if (_.isNaN(parseFloat(this.state.messageObject.id))) {
      this.setState({ messageIDError: 'Invalid ID' });
      valid = false;
    }

    return valid;
  }

  handleMessageChange(e) {
    const messageObject = this.state.messageObject;
    messageObject.message = e.target.value;
    this.setState({ messageObject });
  }

  handleMessageTimeChange(e) {
    this.setState({ messageTime: e.target.value });
  }

  handleMessageTypeChange(e) {
    console.log(e.target.value);
    const messageObject = this.state.messageObject;
    messageObject.type = e.target.value;
    this.setState({ messageObject });
  }

  handleMessageIDChange(e) {
    const messageObject = this.state.messageObject;
    messageObject.id = e.target.value;
    this.setState({ messageID: e.target.value });
  }

  removeMessage(e) {
    const config = this.state.config;
    if (_.isEmpty(config.messages)) {
      config.messages = {};
    }

    delete config.messages[e.target.parentElement.id];

    this.props.firebase.set(config, (err) => {
      this.setState({ config });
    });
  }

  renderMessageTable() {
    console.log(this.state.config.messages);
    const tableStyle = {
      margin: '0 auto',
    };

    if (!this.state.loaded) {
      return 'Loading...';
    } if (_.isEmpty(this.state.config.messages)) {
      return '';
    }

    return (
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th>Time (minutes)</th>
            <th>Message</th>
            <th>Type</th>
            <th>ID</th>
            <th>Delete</th>
          </tr>
          {this.renderMessages()}
        </tbody>
      </table>
    );
  }

  renderMessages() {
    return _.keys(this.state.config.messages).map(key => (
      <tr key={key} id={key}>
        <td>{convertToMins(key)}</td>
        <td>{this.state.config.messages[key].message}</td>
        <td>{this.state.config.messages[key].type}</td>
        <td>{this.state.config.messages[key].id}</td>
        <td onClick={this.removeMessage}>&times;</td>
      </tr>
    ));
  }

  renderMessageTypes() {
    return _.keys(this.MESSAGE_TYPES).map(key => (
      <option
        key={key}
        value={this.MESSAGE_TYPES[key]}
      >
        {this.MESSAGE_TYPES[key]}
      </option>
    ));
  }

  renderMessageForm() {
    return (
      <form onSubmit={this.handleMessageSubmit}>
        <div>
          <label htmlFor="message">Message</label>
          <input
            type="text"
            id="message"
            value={this.state.messageObject.message}
            onChange={this.handleMessageChange}
          />
          <h3>{this.state.messageError}</h3>
        </div>

        <div>
          <label htmlFor="messageType">Message type</label>
          <select
            id="messageType"
            value={this.state.messageObject.type}
            onChange={this.handleMessageTypeChange}
          >
            {this.renderMessageTypes()}
          </select>
        </div>

        {
          this.state.messageObject.type === MESSAGE_TYPES.system ? ''
            : (
              <div>
                <label htmlFor="messageID">ID to show</label>
                <input
                  type="text"
                  id="messageID"
                  value={this.state.messageObject.id}
                  onChange={this.handleMessageIDChange}
                />
                <h3>{this.state.messageIDError}</h3>
              </div>
            )
        }


        <div>
          <label htmlFor="messageTime">Minutes from start of study</label>
          <input
            type="text"
            id="messageTime"
            value={this.state.messageTime}
            onChange={this.handleMessageTimeChange}
          />
          <h3>{this.state.messageTimeError}</h3>
        </div>

        <button name="submit" type="submit">Create Message</button>
      </form>
    );
  }

  render() {
    return (
      <div>
        <h3>
          {' '}
Set Messages for study
          {' '}
          {this.props.study}
        </h3>

        <div>
          {this.renderMessageTable()}

          <div className="spacer" />

          {this.renderMessageForm()}
        </div>

        <h3>
Change the settings for study
          {' '}
          {this.props.study}
.
        </h3>

        {!this.state.loaded ? 'Loading...' : (
          <form onSubmit={this.handleConfigSubmit}>

            {this.formGeneralInput('usersPerRoom',
              'Users per chat room')}
            {this.formGeneralInput('maxWaitingTime',
              'Max waiting time (in minutes)',
              convertToMins, convertToMs)}
            {this.formGeneralInput('roomOpenTime',
              'Time participants have to chat (in minutes)',
              convertToMins, convertToMs)}
            {this.formGeneralInput('password',
              'Password to continue with study after chat')}
            {this.formGeneralInput('altPassword',
              'Password to continue if not placed in chat room')}

            <div>{this.state.saved && 'Saved!'}</div>
            <button name="submit" type="submit">Save</button>
          </form>
        )}
      </div>
    );
  }
}
ConfigSetter.propTypes = {
  firebase: PropTypes.object.isRequired,
  study: PropTypes.string.isRequired,
};
export default ConfigSetter;
