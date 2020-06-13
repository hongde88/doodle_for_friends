import React from 'react';
import styles from './CoverPanel.module.css';

const CoverPanel = () => {
  // const content = useSelector((state) => state.room.room.content);
  const content = 'Round 1';
  return (
    <div
      style={{
        height: 'calc(100vh - 80px - 60px)',
        border: '1px solid black',
        marginLeft: 20,
        backgroundColor: 'black',
      }}
    >
      <div className={styles.panel}>
        <h2>{content}</h2>
      </div>
    </div>
  );
};

export default CoverPanel;
