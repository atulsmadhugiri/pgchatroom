import React from 'react';

/**
 * Just used to put some vertical space in between components; no functionality.
 */
const Spacer = React.createClass({
  propTypes: {
    height: React.PropTypes.number,
  },

  render() {
    const styles = {
      width: '100%',
      height: this.props.height || 30,
    };

    return (
      <div style={styles} />
    );
  },
});

export default Spacer;
