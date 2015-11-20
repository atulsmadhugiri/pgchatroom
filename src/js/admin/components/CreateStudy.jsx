import React from 'react';
import ReactDOM from 'react-dom';

// import AdminStore from '../stores/AdminStore';

const ERROR_MESSAGE = 'Study has already been created';

const CreateStudy = React.createClass({
  propTypes: {
    studies: React.PropTypes.object.isRequired,
    firebase: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      errorMessage: '',
      hasError: true,
    };
  },

  _handleChange(e) {
    console.log(e.target.value);
    const value = e.target.value;
    let errorMessage;
    let hasError;
    if (this.props.studies.has(value)) {
      errorMessage = ERROR_MESSAGE;
      hasError = true;
    } else {
      errorMessage = '';
      hasError = false;
    }

    this.setState({
      errorMessage: errorMessage,
      hasError: hasError,
    });
  },

  _handleSubmit(e) {
    e.preventDefault();
    const study = ReactDOM.findDOMNode(this.refs.createStudy).value;
    const studies = {
      studies: [...this.props.studies.add(study)],
    };

    this.props.firebase.set(studies, (err) => {
      this.setState({ loaded: true });
      console.log(err);
    });
  },

  _hasError() {
    return this.state.hasError;
  },

  render() {
    return (
      <form onSubmit={this._handleSubmit}>
        <div>
          <label htmlFor="createStudy">New Study</label>
          <input
            ref="createStudy"
            type="text"
            id="createStudy"
            onChange={this._handleChange}/>
        </div>

        <h3>{this.state.errorMessage}</h3>
        <button name="submit" disabled={this._hasError()}>Save</button>
      </form>
    );
  },
});

export default CreateStudy;
