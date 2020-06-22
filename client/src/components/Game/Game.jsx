import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
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
  const turnWord = useSelector((state) => state.room.room.turnWord);
  const scoreBoard = useSelector((state) => state.room.room.scoreBoard);
  const finalScoreBoard = useSelector(
    (state) => state.room.room.finalScoreBoard
  );

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