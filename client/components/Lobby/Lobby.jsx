import React from 'react';
import RoomSettings from '../RoomSettings/RoomSettings';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Avatar from '../Avatar/Avatar';
import styles from './Lobby.module.css';

const Room = () => {
  const players = [
    { index: 0, name: 'Ly' },
    { index: 1, name: 'Duc' },
    { index: 2, name: 'Mic' },
    { index: 0, name: 'Hoang' },
    { index: 2, name: 'Hoa' },
    { index: 0, name: 'Phu' },
    { index: 2, name: 'Vy' },
    { index: 0, name: 'Nhu-Ngoc' },
  ];
  return (
    <Row>
      <Col sm='4'>
        <RoomSettings />
      </Col>
      <Col sm={{ span: 7, offset: 1 }}>
        <div className={styles.playersDiv}>
          {players.map((player, idx) => (
            <Avatar index={player.index} name={player.name} you={idx === 0} />
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default Room;
