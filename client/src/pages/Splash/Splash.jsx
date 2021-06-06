import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Logo from '../../components/Logo/Logo';
import PlayerCreation from '../../components/PlayerCreation/PlayerCreation';
import styles from './Splash.module.css';

const Splash = () => {
  return (
    <Row className={styles.splashContainer}>
      <Col className={styles.leftContainer}></Col>
      <Col className={styles.rightContainer}>
        <Logo></Logo>
        <PlayerCreation />
      </Col>
    </Row>
  );
};

export default Splash;
