import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { startRoomTimer } from '../../store/actions/room';
import { userPickAWord, setUserSelectedWord } from '../../store/actions/user';
import PlayerList from '../PlayerList/PlayerList';
import GameInfo from '../GameInfo/GameInfo';
import DrawingBoard from '../DrawingBoard/DrawingBoard';
import CoverPanel from '../CoverPanel/CoverPanel';

const Game = () => {
  const dispatch = useDispatch();
  const duration = useSelector((state) => state.room.room.drawTime);
  const roomId = useSelector((state) => state.room.room.roomId);
  const isCurrentPlayer = useSelector(
    (state) => state.user.user.isCurrentPlayer
  );
  const currentRound = useSelector((state) => state.room.room.currentRound);
  const currentPlayerName = useSelector(
    (state) => state.room.room.currentPlayerName
  );
  const gameState = useSelector((state) => state.room.room.gameState);
  const words = useSelector((state) => state.user.user.words);
  const wordHint = useSelector((state) => state.room.room.wordHint);
  const selectedWord = useSelector((state) => state.user.user.selectedWord);

  if (!roomId) {
    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    );
  }

  // if (isCurrentPlayer) {
  //   switch (gameState) {
  //     case 'choosing':
  //       return (
  //         <div onClick={dispatch({ type: 'pick word', payload: 'sun' })}>
  //           Choose word
  //         </div>
  //       );
  //     case 'roundResults':
  //       return <div>Room results</div>;
  //     case 'endGame':
  //       return <div>End game</div>;
  //     default:
  //       return <div>Drawing</div>;
  //   }
  // }

  const startTimer = () => {
    dispatch(startRoomTimer({ duration, roomId }));
  };

  const pickAWord = (e) => {
    const selectedWord = e.target.innerText;
    dispatch(userPickAWord(selectedWord));
    dispatch(setUserSelectedWord(selectedWord));
    startTimer();
  };

  return (
    <>
      <GameInfo
        duration={duration}
        word={isCurrentPlayer ? selectedWord : wordHint}
      />
      <Row>
        <Col md='2'>
          <PlayerList />
        </Col>
        <Col md='10' style={{ marginRight: 0, padding: 0 }}>
          {gameState === 'starting' && currentRound && (
            <CoverPanel isRound={true}>Round {currentRound}</CoverPanel>
          )}
          {gameState === 'choosing' && !isCurrentPlayer && (
            <CoverPanel>{currentPlayerName} is choosing</CoverPanel>
          )}
          {gameState === 'choosing' && isCurrentPlayer && words && (
            <CoverPanel>
              {words.map((word) => (
                <Button
                  key={word}
                  style={{ margin: '0 20px' }}
                  onClick={pickAWord}
                >
                  {word}
                </Button>
              ))}
            </CoverPanel>
          )}
          {gameState === 'drawing' && <DrawingBoard show={isCurrentPlayer} />}
        </Col>
      </Row>
    </>
  );
};

export default Game;
