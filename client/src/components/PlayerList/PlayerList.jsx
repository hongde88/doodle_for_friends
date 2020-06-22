import CreateIcon from '@material-ui/icons/Create';
import React from 'react';
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

    return idx >= 0 ? idx + 1 : null;
  };

  return (
    <div className={styles.playersDiv}>
      {players.map((player, idx) => {
        const rank = (
          <div className={styles.rankDiv}>#{getRank(player.name)}</div>
        );
        const user = (
          <div className={styles.nameAndScoreDiv}>
            {player.name} {player.name === userName && '(you)'}
            {getScore(player.name)}
          </div>
        );
        const avatar = (
          <div className={styles.avatarDiv}>
            <Col>{player.name === currentPlayerName && <CreateIcon />}</Col>
            <Avatar key={idx} index={player.index} small={true} />
          </div>
        );

        return (
          <div key={`${player}_${idx}`} className={styles.playerDiv}>
            {rank}
            {user}
            {avatar}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerList;
