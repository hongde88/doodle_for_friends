import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import {
  quitAndCleanUpGame,
  setRoomLoading,
  // setRoom,
  setRoomNavigatedFrom,
  startAnotherGame,
  startRoomTimer,
} from '../../store/actions/room';
import {
  setUserLoading,
  setUserSelectedWord,
  userLeaveRoom,
  userPickAWord,
} from '../../store/actions/user';
import CoverPanel from '../CoverPanel/CoverPanel';
import DrawingBoard from '../DrawingBoard/DrawingBoard';
import GameInfo from '../GameInfo/GameInfo';
import PlayerList from '../PlayerList/PlayerList';

const Game = () => {
  const history = useHistory();
  const { id } = useParams();
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
  const turnWord = useSelector((state) => state.room.room.turnWord);
  const scoreBoard = useSelector((state) => state.room.room.scoreBoard);
  const finalScoreBoard = useSelector(
    (state) => state.room.room.finalScoreBoard
  );
  const isHost = useSelector((state) => state.user.user.isHost);

  useEffect(() => {
    window.onpopstate = (e) => {
      dispatch(userLeaveRoom());
      dispatch(setRoomLoading());
      dispatch(setUserLoading());
      if (id) {
        dispatch(setRoomNavigatedFrom(id));
      }
    };
  });

  useEffect(() => {
    if (gameState === 'quit') {
      history.push(`/rooms/${roomId}`);
    }
  }, [gameState, history, roomId]);

  if (!roomId) {
    dispatch(setRoomNavigatedFrom(id));
    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    );
  }

  const playAgain = () => {
    dispatch(startAnotherGame(roomId));
  };

  const quitGame = () => {
    // history.go(-1);
    dispatch(quitAndCleanUpGame(roomId));
    // dispatch(setRoomLoading());
    // dispatch(setRoom({}));
  };

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
        currentRound={currentRound > 0 ? currentRound : null}
        stopSound={
          gameState === 'show turn result' || gameState === 'game ended'
        }
      />
      <Row>
        <Col md='3'>
          <PlayerList />
        </Col>
        <Col md='9' style={{ marginRight: 0, padding: 0 }}>
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
          {gameState === 'show turn result' && turnWord && scoreBoard && (
            <CoverPanel>
              <Table responsive>
                <thead>
                  <tr>
                    <th colSpan={2}>
                      The word was{' '}
                      <span style={{ color: 'green' }}>{turnWord}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scoreBoard.map((score) => {
                    return (
                      <tr key={score.name}>
                        <td>{score.name}</td>
                        <td>
                          <span style={{ color: 'green' }}>{score.points}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CoverPanel>
          )}
          {gameState === 'game ended' && finalScoreBoard && (
            <CoverPanel>
              <Table responsive>
                <thead>
                  <tr>
                    <th colSpan={2}>Final Result</th>
                  </tr>
                </thead>
                <tbody>
                  {finalScoreBoard.map((score) => {
                    return (
                      <tr key={score.name}>
                        <td>{score.name}</td>
                        <td>
                          <span style={{ color: 'green' }}>
                            {score.totalPoints}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {isHost && (
                    <tr>
                      <td>
                        <Button
                          style={{ margin: '0 20px' }}
                          onClick={playAgain}
                        >
                          Play Again
                        </Button>
                      </td>
                      <td>
                        <Button style={{ margin: '0 20px' }} onClick={quitGame}>
                          Quit
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CoverPanel>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Game;
