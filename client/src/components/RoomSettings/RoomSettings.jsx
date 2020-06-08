import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setRoomSettings } from '../../store/actions/room';

const RoomSettings = () => {
  const dispatch = useDispatch();

  const { maxRound, drawTime, exclusive, playable } = useSelector(
    (state) => state.room.room
  );
  const isHost = useSelector((state) => state.user.user.isHost);
  const roomId = useSelector((state) => state.room.room.roomId);

  const [customWords, setCustomWords] = useState('');

  const updateRoomSettings = (maxRound, drawTime, words, exclusive) => {
    dispatch(
      setRoomSettings({
        maxRound,
        drawTime,
        words,
        exclusive,
      })
    );
  };

  return (
    <Form>
      <Form.Group>
        <h3>Game settings</h3>
      </Form.Group>

      <Form.Group controlId='rounds'>
        <Form.Label>Rounds</Form.Label>
        <Form.Control
          as='select'
          value={maxRound}
          onChange={(e) =>
            updateRoomSettings(
              parseInt(e.target.value, 10),
              drawTime,
              customWords,
              exclusive
            )
          }
          disabled={!isHost}
          custom
        >
          {[...Array(9)].map((_, i) => (
            <option key={`rounds_${i + 2}`}>{i + 2}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId='drawTime'>
        <Form.Label>Draw time in seconds</Form.Label>
        <Form.Control
          as='select'
          value={drawTime}
          onChange={(e) =>
            updateRoomSettings(
              maxRound,
              parseInt(e.target.value, 10),
              customWords,
              exclusive
            )
          }
          disabled={!isHost}
          custom
        >
          {[...Array(16)].map((_, i) => (
            <option key={`drawTime_${i + 3}`}>{(i + 3) * 10}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId='customWords'>
        <Form.Label>Custom Words</Form.Label>
        <Form.Control
          as='textarea'
          value={customWords}
          onChange={(e) => {
            setCustomWords(e.value);
            updateRoomSettings(maxRound, drawTime, e.target.value, exclusive);
          }}
          rows='3'
          disabled={!isHost}
          placeholder='Enter words separated by a comma; e.g. house,flower,tree,virus,death'
        />
      </Form.Group>

      <Form.Group controlId='exclusive'>
        <Form.Check
          type='checkbox'
          id='custom-exclusively'
          checked={exclusive}
          disabled={!isHost}
          onChange={(e) =>
            updateRoomSettings(
              maxRound,
              drawTime,
              customWords,
              e.target.checked
            )
          }
          label='Use custom words exclusively'
        />
      </Form.Group>

      {/* {isHost && playable && ( */}
      <Form.Group>
        <Link to={`/rooms/${roomId}/game`}>
          <Button>START!</Button>
        </Link>
      </Form.Group>
      {/* )} */}
    </Form>
  );
};

export default RoomSettings;
