import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createPrivateRoom, joinRoom } from '../../store/actions/room';
import Avatar from '../Avatar/Avatar';
import styles from './PlayerCreation.module.css';

const NUMBER_OF_AVATARS = 11;

const PlayerCreation = () => {
  const dispatch = useDispatch();

  const [awaitNav, setAwaitNav] = useState(false);

  const [username, setUsername] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const history = useHistory();
  const roomId = useSelector((state) => state.room.room.roomId);
  const navigatedFrom = useSelector((state) => state.room.navigatedFrom);
  const user = useSelector((state) => state.user.user.name);
  const errors = {
    roomError: useSelector((state) => state.room.errors.message),
    userError: useSelector((state) => state.user.errors.message),
  };

  useEffect(() => {
    if (awaitNav && roomId && user) {
      if (!errors.roomError && !errors.userError) {
        history.push(`/rooms/${roomId}`);
      }
    }
  }, [roomId, navigatedFrom, user, history, errors, awaitNav]);

  const goToPrivateRoom = () => {
    setAwaitNav(true);
    history.replace('/', {});
    dispatch(createPrivateRoom(username, avatarIndex));
  };

  const joinPublicOrPrivateRoom = () => {
    setAwaitNav(true);
    dispatch(joinRoom(username, avatarIndex, roomId || navigatedFrom));
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
      {(errors.roomError || errors.userError) && (
        <Alert variant='danger'>{errors.roomError || errors.userError}</Alert>
      )}
      <div className={styles.avatarDiv}>
        <Button variant='icon' size='sm' onClick={prevAvatar}>
          <ArrowLeft className={styles.leftArrow} />
        </Button>
        <Avatar index={avatarIndex} />
        <Button variant='icon' size='sm' onClick={nextAvatar}>
          <ArrowRight className={styles.rightArrow} />
        </Button>
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
          <Button variant='primary' onClick={joinPublicOrPrivateRoom}>
            PLAY NOW
          </Button>
        </Form.Group>

        {(roomId || navigatedFrom) && (
          <Form.Group>
            <Button variant='primary' onClick={joinPublicOrPrivateRoom}>
              JOIN ROOM {roomId || navigatedFrom}
            </Button>
          </Form.Group>
        )}

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
