import React from 'react';
import PropType from 'prop-types';
import Image from 'react-bootstrap/Image';
import styles from './Avatar.module.css';

const Avatar = ({ index }) => {
  return (
    <Image
      className={styles.avatar}
      src={`images/avatars/avatar_${index}.png`}
    />
  );
};

Avatar.defaultProps = {
  index: 0,
};

Avatar.propTypes = {
  index: PropType.number,
};

export default Avatar;
