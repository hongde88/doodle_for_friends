import React from 'react';
import propType from 'prop-types';
import BrushIcon from '@material-ui/icons/BrushTwoTone';

const Logo = ({ size }) => {
  const letters = [
    { letter: 'D', color: 'mediumvioletred' },
    { letter: 'O', color: 'orange' },
    { letter: 'O', color: 'yellowgreen' },
    { letter: 'D', color: 'slateblue' },
    { letter: 'L', color: 'blueviolet' },
    { letter: 'E', color: 'purple' },
  ];

  const sizeInPx = size === 'lg' ? 96 : 48;
  const iconStyle = { width: sizeInPx, height: sizeInPx, fill: 'lightblue' };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: size === 'sm' ? 'start' : 'center',
      }}
    >
      {letters.map((letter, idx) => (
        <span
          key={idx}
          style={{
            color: letter.color,
            fontSize: `${sizeInPx}px`,
          }}
        >
          {letter.letter}
        </span>
      ))}
      <BrushIcon style={iconStyle} />
    </div>
  );
};

Logo.defaultProps = {
  size: 'lg',
};

Logo.propType = {
  size: propType.string,
};

export default Logo;
