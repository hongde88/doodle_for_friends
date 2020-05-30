import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Avatar from '../Avatar/Avatar';
import styles from './PlayerCreation.module.css';
import { setUser } from '../../store/actions/user';

const NUMBER_OF_AVATARS = 3;

const PlayerCreation = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

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
          src={`images/arrow.png`}
          className={styles.arrow}
          onClick={prevAvatar}
        />
        <Avatar index={avatarIndex} />
        <Image
          src={`images/arrow.png`}
          className={`${styles.rightArrow} ${styles.arrow}`}
          onClick={nextAvatar}
        />
      </div>
      <Form>
        <Form.Group controlId='username'>
          <Form.Control
            type='username'
            placeholder='Enter username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Button variant='primary' type='submit'>
            PLAY NOW
          </Button>
        </Form.Group>

        <Form.Group>
          <Link href='/room'>
            <Button
              variant='primary'
              type='submit'
              onClick={() => dispatch(setUser({ username }))}
            >
              CREATE PRIVATE ROOM
            </Button>
          </Link>
        </Form.Group>
      </Form>
    </div>
  );
};

export default PlayerCreation;
