import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { setRoomNavigatedFrom } from '../../store/actions/room';
import { clearCurrentUser } from '../../store/actions/user';
import Avatar from '../Avatar/Avatar';
import RoomSettings from '../RoomSettings/RoomSettings';
import styles from './Lobby.module.css';

const Lobby = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user.name);
  const players = useSelector((state) => state.room.room.users);

  const [copied, setCopied] = useState(false);

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
    <div className={styles.lobbyContainer}>
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
      <div className={styles.copyRoomId}>
        Room Id: {window.location.href}
        <CopyToClipboard
          text={window.location.href}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <Button variant={copied ? 'success' : 'primary'}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default Lobby;
