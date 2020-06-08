import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { startRoomTimer } from '../../store/actions/room';
import PlayerList from '../PlayerList/PlayerList';
import Timer from '../Timer/Timer';

const Game = () => {
  const dispatch = useDispatch();
  const duration = useSelector((state) => state.room.room.drawTime);
  const roomId = useSelector((state) => state.room.room.roomId);

  if (!roomId) {
    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    );
  }

  const startTimer = () => {
    dispatch(startRoomTimer({ duration, roomId }));
  };

  return (
    <>
      <Row className='align-items-center' style={{ background: 'lightgrey' }}>
        <Col md='2'>
          <Timer startTime={duration} />
        </Col>
        <Col md='8'>_ _ _ _ _</Col>
        <Col md='2'></Col>
      </Row>
      <Row>
        <Col md='2'>
          <PlayerList />
        </Col>
        <Col md='10' style={{ marginRight: 0, padding: 0 }}>
          <div
            style={{
              height: 'calc(100vh - 80px - 60px)',
              border: '1px solid black',
              marginLeft: 20,
            }}
          >
            Drawing Board
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Game;
