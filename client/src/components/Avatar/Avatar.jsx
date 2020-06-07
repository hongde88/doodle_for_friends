import React from 'react';
import PropType from 'prop-types';
import Image from 'react-bootstrap/Image';
import styles from './Avatar.module.css';

const Avatar = ({ index, name, you, host }) => {
  return (
    <div>
      <Image
        className={styles.avatar}
        src={`/images/avatars/avatar_${index}.png`}
      />
      {name && (
        <h4>
          {name} {you && '(you)'} {host && '(host)'}
        </h4>
      )}
    </div>
  );
};

Avatar.defaultProps = {
  index: 0,
  you: false,
  host: false,
};

Avatar.propTypes = {
  index: PropType.number,
  name: PropType.string,
  you: PropType.bool,
  host: PropType.bool,
};

export default Avatar;
