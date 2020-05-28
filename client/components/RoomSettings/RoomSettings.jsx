import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Link from 'next/link';

const RoomSettings = () => {
  return (
    <Form>
      <Form.Group as={Row}>
        <h3>Game settings</h3>
      </Form.Group>

      <Form.Group as={Row} controlId='rounds'>
        <Form.Label>Rounds</Form.Label>
        <Form.Control as='select' custom>
          {[...Array(9)].map((_, i) => (
            <option>{i + 2}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group as={Row} controlId='drawTime'>
        <Form.Label>Draw time in seconds</Form.Label>
        <Form.Control as='select' custom>
          {[...Array(16)].map((_, i) => (
            <option>{(i + 3) * 10}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group as={Row} controlId='customWords'>
        <Form.Label>Custom Words</Form.Label>
        <Form.Control
          as='textarea'
          rows='3'
          placeholder='Enter words separated by a comma; e.g. house,flower,tree,virus,death'
        />
      </Form.Group>

      <Form.Group as={Row} controlId='exclusive'>
        <Form.Check
          type='checkbox'
          id='custom-exclusively'
          label='Use custom words exclusively'
        />
      </Form.Group>

      <Form.Group as={Row}>
        <Button type='submit'>START!</Button>
      </Form.Group>
    </Form>
  );
};

export default RoomSettings;
