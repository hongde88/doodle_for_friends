import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { createPrivateRoom } from '../../store/actions/room';
import Avatar from '../Avatar/Avatar';
import styles from './PlayerCreation.module.css';

const NUMBER_OF_AVATARS = 3;

const PlayerCreation = () => {
  const dispatch = useDispatch();

  const [awaitNav, setAwaitNav] = useState(false);

  const [username, setUsername] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const roomId = useSelector((state) => state.room.roomId);
  const user = useSelector((state) => state.user.user);

  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (awaitNav && roomId && user) {
      if (location.state === undefined || location.state.room === undefined) {
        console.log(roomId);
        history.push(`/rooms/${roomId}`);
      } else {
        console.log(location.state.room);
        history.push(`/rooms/${location.state.room}`);
      }
    }
  }, [roomId, user, history, location, awaitNav]);

  const goToPrivateRoom = () => {
    setAwaitNav(true);
    history.replace('/', {});
    dispatch(createPrivateRoom(username));
  };

  const prevAvatar = () => {
    if (avatarIndex - 1 < 0) {
      setAvatarIndex(NUMBER_OF_AVATARS - 1);
    } else {
      setAvatarIndex(avatarIndex - 1);
    }
  };

  const nextAvatar = () => {
    if (avatarIndex + 1 === NUMBER_OF_AVATARS) {
      setAvatarIndex(0);
    } else {
      setAvatarIndex(avatarIndex + 1);
    }
  };

  return (
    <div className='d-flex flex-column align-items-center'>
      <div className={styles.avatarDiv}>
        <Image
          src={`/images/arrow.png`}
          className={styles.arrow}
          onClick={prevAvatar}
        />
        <Avatar index={avatarIndex} />
        <Image
          src={`/images/arrow.png`}
          className={`${styles.rightArrow} ${styles.arrow}`}
          onClick={nextAvatar}
        />
      </div>
      <Form className='d-flex flex-column align-items-center'>
        <Form.Group controlId='username'>
          <Form.Control
            type='username'
            placeholder='Enter username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Button
            variant='primary'
            // onClick={() => dispatch(joinPrivateRoom(username))}
          >
            PLAY NOW
          </Button>
        </Form.Group>

        <Form.Group>
          <Button variant='primary' onClick={goToPrivateRoom}>
            CREATE PRIVATE ROOM
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default PlayerCreation;
