import CreateIcon from '@material-ui/icons/Create';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSelector } from 'react-redux';
import Avatar from '../Avatar/Avatar';
import styles from './PlayerList.module.css';

const PlayerList = () => {
  const players = useSelector((state) => state.room.room.users);
  const userName = useSelector((state) => state.user.user.name);
  const currentPlayerName = useSelector(
    (state) => state.room.room.currentPlayerName
  );
  const finalScoreBoard = useSelector(
    (state) => state.room.room.finalScoreBoard
  );

  const getScore = (playerName) => {
    let idx = -1;

    if (finalScoreBoard) {
      idx = finalScoreBoard.findIndex((score) => score.name === playerName);
    }

    return idx >= 0 ? finalScoreBoard[idx].totalPoints : null;
  };

  const getRank = (playerName) => {
    let idx = -1;

    if (finalScoreBoard) {
      idx = finalScoreBoard.findIndex((score) => score.name === playerName);
    }

    return idx >= 0 ? `#${idx + 1}` : '';
  };

  return (
    <div className={styles.playersDiv}>
      {players.map((player, idx) => {
        return (
          <Row key={`${player}_${idx}`} className={styles.playerDiv}>
            <Col>
              <Avatar key={idx} index={player.index} small={true} />
            </Col>
            <Col>
              <Row>{player.name} </Row>
              <Row>{player.name === userName && '(you)'}</Row>
              <Row>{player.name === currentPlayerName && <CreateIcon />}</Row>
            </Col>
            <Col>{getRank(player.name)}</Col>
            <Col>{getScore(player.name)}</Col>
          </Row>
        );
      })}
    </div>
  );
};

export default PlayerList;
