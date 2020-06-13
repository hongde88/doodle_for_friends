import React from 'react';
import Timer from '../Timer/Timer';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PropType from 'prop-types';

const GameInfo = ({ duration }) => {
  return (
    <Row className='align-items-center' style={{ background: 'lightgrey' }}>
      <Col md='2'>
        <Timer startTime={duration} />
      </Col>
      <Col md='8'>_ _ _ _ _</Col>
      <Col md='2'></Col>
    </Row>
  );
};

GameInfo.propTypes = {
  duration: PropType.number.isRequired,
};

export default GameInfo;
