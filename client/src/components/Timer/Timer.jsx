import React from 'react';
import { useSelector } from 'react-redux';
import PropType from 'prop-types';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({ startTime }) => {
  const guessingRemainingTime = useSelector(
    (state) => state.room.guessingRemainingTime
  );
  return (
    <div style={{ width: 60, height: 'auto' }}>
      <CircularProgressbar
        value={guessingRemainingTime || startTime}
        text={`${
          guessingRemainingTime ||
          (guessingRemainingTime === 0 ? guessingRemainingTime : startTime)
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