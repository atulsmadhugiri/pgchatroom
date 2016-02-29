import React from 'react';
import _ from 'underscore';

import { convertToMs, convertToMins } from '../../chat/util';
import { DEFAULT_ROOM_VALUES } from '../../constants';

const ConfigSetter = React.createClass({
  propTypes: {
    firebase: React.PropTypes.object.isRequired,
    study: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      loaded: false, // loaded data from Firebase yet?
      saved: false, // saved back to Firebase yet?
      message: '',
      message_error: '',
      message_time: '',
      message_time_error: '',
      // All attributes default to false
      config: {
        usersPerRoom: false,
        maxWaitingTime: false,
        roomOpenTime: false,
        warning: false,
        password: false,
        altPassword: false,
        messages: false,
      },
    };
  },

  componentWillMount() {
    // Only read in initial data
    this._loadConfig(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.props.firebase.off();
    this._loadConfig(nextProps);
  },

  _loadConfig(props) {
    props.firebase.on('value', snapshot => {
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
  },

  _handleConfigSubmit(e) {
    e.preventDefault();
    this.props.firebase.set(this.state.config, (err) => {
      this.setState({ saved: !err });
      console.log(this.state);
    });
  },

  // transform arg is used to change from mins to ms
  _handleChange(attr, transform = _.identity, e) {
    const config = _.extend({}, this.state.config, {
      [attr]: transform(e.target.value),
    });

    this.setState({
      saved: false,
      config: config,
    });
  },

  _formGeneralInput(attr, label, convertData = _.identity,
      convertInput = _.identity) {
    return (
      <div>
        <label htmlFor={attr}>{label}</label>
        <input type="text"
          id={attr}
          value={convertData(this.state.config[attr])}
          onChange={_.partial(this._handleChange, attr, convertInput)} />
        <div className="spacer"></div>
      </div>
    );
  },

  _handleMessageSubmit(e) {
    e.preventDefault();

    if (this._hasValidMessage()) {
      const config = this.state.config;
      if (_.isUndefined(config.messages)) {
        config.messages = {};
      }

      config.messages[convertToMs(parseFloat(this.state.message_time))] = this.state.message;

      this.props.firebase.set(config, (err) => {
        this.setState({ message: '', message_time: '', config: config });
        console.log(this.state);
      });
    }
  },

  _hasValidMessage() {
    let valid = true;

    if (_.isEmpty(this.state.message)) {
      this.setState({ message_error: 'Empty Message' });
      valid = false;
    }

    if (_.isNaN(parseFloat(this.state.message_time))) {
      this.setState({ message_time_error: 'Invalid Time'});
      valid = false;
    }

    return valid;
  },

  _handleMessageChange(e) {
    this.setState({ message: e.target.value });
  },

  _handleMessageTimeChange(e) {
    this.setState({ message_time: e.target.value });
  },

  _removeMessage() {
  },

  _renderMessages() {
    return _.keys(this.state.config.messages).map(key => {
      return (
        <tr key={key}>
          <td>{convertToMins(key)}</td>
          <td>{this.state.config.messages[key]}</td>
          <td>&times;</td>
        </tr>
      );
    });
  },

  _renderMessageForm() {
    return (
      <form onSubmit={this._handleMessageSubmit}>
        <div>
          <label htmlFor="message">Message</label>
          <input type="text"
            id="message"
            value={this.state.message}
            onChange={this._handleMessageChange} />
          <h3>{this.state.message_error}</h3>
        </div>


        <div>
          <label htmlFor="message_time">Minutes from start of study</label>
          <input type="text"
            id="message_time"
            value={this.state.message_time}
            onChange={this._handleMessageTimeChange} />
          <h3>{this.state.message_time_error}</h3>
        </div>

        <button name="submit">Create Message</button>
      </form>
    );
  },

  render() {
    const tableStyle = {
      margin: '0 auto',
    };

    return (
      <div>
        <h3> Set Messages for study {this.props.study}</h3>

        {!this.state.loaded ? 'Loading...' :
          <div>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th>Time (minutes)</th>
                  <th>Message</th>
                  <th>Delete</th>
                </tr>
                {this._renderMessages()}
              </tbody>
            </table>
            <div className="spacer"></div>
            {this._renderMessageForm()}
          </div>
        }

        <h3>Change the settings for study {this.props.study}.</h3>

        {!this.state.loaded ? 'Loading...' :
          <form onSubmit={this._handleConfigSubmit}>

            {this._formGeneralInput('usersPerRoom',
              'Users per chat room')}
            {this._formGeneralInput('maxWaitingTime',
              'Max waiting time (in minutes)',
              convertToMins, convertToMs)}
            {this._formGeneralInput('roomOpenTime',
              'Time participants have to chat (in minutes)',
              convertToMins, convertToMs)}
            {this._formGeneralInput('warning',
              'Minutes remaining before chat end warning',
              convertToMins, convertToMs)}
            {this._formGeneralInput('password',
              'Password to continue with study after chat')}
            {this._formGeneralInput('altPassword',
              'Password to continue if not placed in chat room')}

            <div>{this.state.saved && 'Saved!'}</div>
            <button name="submit">Save</button>
          </form>
        }
      </div>
    );
  },
});

export default ConfigSetter;
