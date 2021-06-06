import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropType from 'prop-types';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useAudio } from '../Audio/Audio';
import { resetRoomTimer } from '../../store/actions/room';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({ startTime, stopSound }) => {
  const guessingRemainingTime = useSelector(
    (state) => state.room.guessingRemainingTime
  );
  const dispatch = useDispatch();
  const playTickAudio = useAudio('/sounds/tick.wav').playAudio;
  const playBeepAudio = useAudio('/sounds/beep.mp3').playAudio;

  useEffect(() => {
    if (stopSound) {
      playTickAudio(false);
      dispatch(resetRoomTimer());
    }

    if (guessingRemainingTime === 8) {
      playTickAudio(true);
    }

    if (guessingRemainingTime === 0) {
      playBeepAudio(true);
    }
  }, [guessingRemainingTime, stopSound]);

  return (
    <div style={{ width: 60, height: 'auto', margin: '10px' }}>
      <CircularProgressbar
        value={guessingRemainingTime || startTime}
        text={`${
          guessingRemainingTime ||
          (guessingRemainingTime === 0 ? guessingRemainingTime : startTime)
        }`}
        maxValue={startTime}
        counterClockwise={true}
        styles={{
          text: {
            fontSize: '40px',
          },
        }}
      />
    </div>
  );
};

Timer.propTypes = {
  startTime: PropType.number.isRequired,
  stopSound: PropType.bool,
};

export default Timer;
