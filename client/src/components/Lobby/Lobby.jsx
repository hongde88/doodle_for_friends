import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import RoomSettings from '../RoomSettings/RoomSettings';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Avatar from '../Avatar/Avatar';
import styles from './Lobby.module.css';
import { clearCurrentUser } from '../../store/actions/user';

const Lobby = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      console.log('clean up');
      dispatch(clearCurrentUser());
    };
  }, [dispatch]);

  if (!user) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { room: id },
        }}
      />
    );
  }

  const players = [
    { index: user.index, name: user.name },
    { index: 1, name: 'Duc' },
    { index: 2, name: 'Mic' },
    { index: 0, name: 'Hoang' },
    { index: 2, name: 'Hoa' },
    { index: 0, name: 'Phu' },
    { index: 2, name: 'Vy' },
    { index: 0, name: 'Nhu-Ngoc' },
  ];
  return (
    <>
      <Row>
        <Col sm='4'>
          <RoomSettings />
        </Col>
        <Col sm={{ span: 7, offset: 1 }}>
          <div className={styles.playersDiv}>
            {players.map((player, idx) => (
              <Avatar
                key={idx}
                index={player.index}
                name={player.name}
                you={idx === 0}
              />
            ))}
          </div>
        </Col>
      </Row>
      <Row>Room Id: {window.location.href}</Row>
    </>
  );
};

export default Lobby;
