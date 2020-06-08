import React from 'react';
import { useSelector } from 'react-redux';
import PropType from 'prop-types';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({ startTime }) => {
  const remainingTime = useSelector((state) => state.room.remainingTime);
  return (
    <div style={{ width: 80, height: 80 }}>
      <CircularProgressbar
        value={remainingTime || startTime}
        text={`${
          remainingTime || (remainingTime === 0 ? remainingTime : startTime)
        }`}
        maxValue={startTime}
        counterClockwise={true}
      />
    </div>
  );
};

Timer.propTypes = {
  startTime: PropType.number.isRequired,
};

export default Timer;
