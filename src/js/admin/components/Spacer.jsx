import React from 'react';

/**
 * Just used to put some vertical space in between components; no functionality.
 */
function Spacer(props) {
  const { height } = props;
  const styles = {
    width: '100%',
    height: height || 30,
  };
  return <div style={styles} />;
}

export default Spacer;
