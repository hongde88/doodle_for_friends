import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { startRoomTimer } from '../../store/actions/room';
import PlayerList from '../PlayerList/PlayerList';
import GameInfo from '../GameInfo/GameInfo';
import DrawingBoard from '../DrawingBoard/DrawingBoard';

const Game = () => {
  const dispatch = useDispatch();
  const duration = useSelector((state) => state.room.room.drawTime);
  const roomId = useSelector((state) => state.room.room.roomId);
  const isPlaying = useSelector((state) => state.room.room.isPlaying);

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
      <GameInfo duration={duration} />
      <Row>
        <Col md='2'>
          <PlayerList />
        </Col>
        <Col md='10' style={{ marginRight: 0, padding: 0 }}>
          <DrawingBoard disabled={!isPlaying} />
        </Col>
      </Row>
    </>
  );
};

export default Game;
