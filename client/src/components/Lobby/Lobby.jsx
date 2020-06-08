import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import RoomSettings from '../RoomSettings/RoomSettings';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Avatar from '../Avatar/Avatar';
import styles from './Lobby.module.css';
import { clearCurrentUser } from '../../store/actions/user';
import { setRoomNavigatedFrom, startRoomTimer } from '../../store/actions/room';
import Chat from '../Chat/Chat';
import Timer from '../Timer/Timer';
import Button from 'react-bootstrap/Button';

const Lobby = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user.name);
  const players = useSelector((state) => state.room.room.users);
  const duration = useSelector((state) => state.room.room.drawTime);
  const roomId = useSelector((state) => state.room.room.roomId);

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

  const startTimer = () => {
    console.log(duration);
    dispatch(startRoomTimer({ duration, roomId }));
  };

  return (
    <Row>
      <Col md='8'>
        <Row>
          <Col md='4'>
            <RoomSettings />
          </Col>
          <Col md={{ span: 7, offset: 1 }}>
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
      </Col>
      <Col md='2'>
        <Chat />
      </Col>
      <Col md='2'>
        <Timer startTime={duration} />
        <Button variant='primary' onClick={startTimer}>
          Start Timer
        </Button>
      </Col>
    </Row>
  );
};

export default Lobby;
