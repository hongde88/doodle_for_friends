import React from 'react';
import Timer from '../Timer/Timer';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PropType from 'prop-types';

const GameInfo = ({ duration, word, currentRound, stopSound }) => {
  // console.log(word);
  return (
    <Row className='align-items-center' style={{ background: 'lightgrey' }}>
      <Col md='2'>
        <Timer startTime={duration} stopSound={stopSound} />
      </Col>
      <Col md='8'>
        <pre style={{ fontSize: '20px' }}>{word}</pre>
      </Col>
      {<Col md='2'>{currentRound > 0 ? `ROUND ${currentRound}` : ''}</Col>}
    </Row>
  );
};

GameInfo.propTypes = {
  duration: PropType.number.isRequired,
  word: PropType.string,
  currentRound: PropType.number,
  stopSound: PropType.bool,
};

export default GameInfo;
