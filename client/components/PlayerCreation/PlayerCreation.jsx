import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Avatar from '../Avatar/Avatar';
import styles from './PlayerCreation.module.css';
import Link from 'next/link';

const NUMBER_OF_AVATARS = 3;

const PlayerCreation = () => {
  const [username, setUsername] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const leftClick = () => {
    if (avatarIndex - 1 < 0) {
      setAvatarIndex(NUMBER_OF_AVATARS - 1);
    } else {
      setAvatarIndex(avatarIndex - 1);
    }
  };

  const rightClick = () => {
    if (avatarIndex + 1 === NUMBER_OF_AVATARS) {
      setAvatarIndex(0);
    } else {
      setAvatarIndex(avatarIndex + 1);
    }
  };

  return (
    <>
      <div className={`${styles.avatarDiv} justify-content-md-center`}>
        <Image
          src={`images/arrow.png`}
          className={styles.arrow}
          onClick={leftClick}
        />
        <Avatar index={avatarIndex} />
        <Image
          src={`images/arrow.png`}
          className={`${styles.rightArrow} ${styles.arrow}`}
          onClick={rightClick}
        />
      </div>
      <Form>
        <Form.Group
          as={Row}
          controlId='username'
          className='justify-content-md-center'
        >
          <Col sm='2'>
            <Form.Control
              type='username'
              placeholder='Enter username'
              value={username}
              onChange={(e) => setUsername(e.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='justify-content-md-center'>
          <Col sm='4'>
            <Button variant='primary' type='submit'>
              PLAY NOW
            </Button>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='justify-content-md-center'>
          <Col sm='6'>
            <Link href='/room'>
              <Button variant='primary' type='submit'>
                CREATE PRIVATE ROOM
              </Button>
            </Link>
          </Col>
        </Form.Group>
      </Form>
    </>
  );
};

export default PlayerCreation;
