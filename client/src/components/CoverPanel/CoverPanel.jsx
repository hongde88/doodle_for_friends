import React from 'react';
import PropTypes from 'prop-types';
import styles from './CoverPanel.module.css';

const CoverPanel = ({ children, isRound }) => {
  // const content = useSelector((state) => state.room.room.content);
  // const content = 'Round 1';
  return (
    <div className={styles.container}>
      <div
        className={`${styles.panel} ${
          isRound ? styles.slideAndAway : styles.slideDown
        }`}
      >
        <h2>{children}</h2>
      </div>
    </div>
  );
};

CoverPanel.defaultProps = {
  isRound: false,
};

CoverPanel.propTypes = {
  isRound: PropTypes.bool,
};

export default CoverPanel;
