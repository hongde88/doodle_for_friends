import React from 'react';
import PropType from 'prop-types';
import Image from 'react-bootstrap/Image';
import styles from './Avatar.module.css';

const Avatar = ({ index, name, you, host, small }) => {
  const size = {
    height: small ? '50px' : '100px',
    width: small ? '50px' : '100px',
  };

  let text = name;
  if (you) {
    text += ' (you)';
  }
  if (host) {
    text += ' (host)';
  }

  return (
    <div>
      <Image
        className={styles.avatar}
        style={size}
        src={`/images/avatars/avatar_${index}.png`}
      />
      {name && (small ? <p>{text}</p> : <h4>{text}</h4>)}
    </div>
  );
};

Avatar.defaultProps = {
  index: 0,
  you: false,
  host: false,
  small: false,
};

Avatar.propTypes = {
  index: PropType.number,
  name: PropType.string,
  you: PropType.bool,
  host: PropType.bool,
  small: PropType.bool,
};

export default Avatar;
