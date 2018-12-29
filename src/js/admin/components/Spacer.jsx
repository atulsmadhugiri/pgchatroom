import React from 'react';
import PropTypes from 'prop-types';

/**
 * Just used to put some vertical space in between components; no functionality.
 */
class Spacer extends React.Component {
  render() {
    const styles = {
      width: '100%',
      height: this.props.height || 30,
    };
    return (
      <div style={styles} />
    );
  }
}

Spacer.propTypes = {
  height: PropTypes.number.isRequired,
};

export default Spacer;
