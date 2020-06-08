import CreateIcon from '@material-ui/icons/Create';
import React from 'react';
import Col from 'react-bootstrap/Col';
import { useSelector } from 'react-redux';
import Avatar from '../Avatar/Avatar';
import styles from './PlayerList.module.css';

const PlayerList = () => {
  const players = useSelector((state) => state.room.room.users);
  const userName = useSelector((state) => state.user.user.name);

  return (
    <div className={styles.playersDiv}>
      {players.map((player, idx) => {
        const rank = <div className={styles.rankDiv}>#{idx + 1}</div>;
        const user = (
          <div className={styles.nameAndScoreDiv}>
            {player.name} {player.name === userName && '(you)'}
            100
          </div>
        );
        const avatar = (
          <div className={styles.avatarDiv}>
            <Col>{idx === 0 && <CreateIcon />}</Col>
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
