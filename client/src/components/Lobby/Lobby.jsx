import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import RoomSettings from '../RoomSettings/RoomSettings';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Avatar from '../Avatar/Avatar';
import styles from './Lobby.module.css';
import { clearCurrentUser } from '../../store/actions/user';
import { setRoomNavigatedFrom } from '../../store/actions/room';

const Lobby = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user.name);
  const players = useSelector((state) => state.room.room.users);

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch]);

  if (!user) {
    if (id) {
      dispatch(setRoomNavigatedFrom(id));
    }
    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    );
  }

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
                host={idx === 0}
                you={player.name === user}
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
