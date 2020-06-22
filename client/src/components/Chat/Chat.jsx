import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { sendMessageToRoom } from '../../store/actions/room';
import styles from './Chat.module.css';

const Chat = () => {
  const dispatch = useDispatch();
  const currentMessage = useSelector((state) => state.room.currentMessage);
  const oldMessages = useSelector((state) => state.room.oldMessages);
  const username = useSelector((state) => state.user.user.name);
  const roomId = useSelector((state) => state.room.room.roomId);

  useEffect(() => {
    if (currentMessage) {
      addMessage(currentMessage.content, currentMessage.color);
    }
  }, [currentMessage]);

  useEffect(() => {
    if (oldMessages) {
      const len = oldMessages.length;
      for (let i = 0; i < len; i++) {
        addMessage(oldMessages[i].message, oldMessages[i].color);
      }
    }
  }, [oldMessages]);

  const sendChat = (e) => {
    if (e.key === 'Enter') {
      const message = e.target.value.trim();
      if (message.length !== 0) {
        dispatch(
          sendMessageToRoom({
            username,
            roomId,
            message,
          })
        );
        e.target.value = '';
        e.target.focus();
      }
    }
  };

  const addMessage = (content, color) => {
    const messageList = document.getElementById('messageList');
    const message = document.createElement('div');
    message.style.color = color;
    message.appendChild(document.createTextNode(content));
    messageList.appendChild(message);
    messageList.scrollTop = messageList.scrollHeight;
  };

  return (
    <div className={styles.container}>
      <div className={styles.messages} id='messageList'></div>
      <Form.Control
        className='chat-input'
        type='text'
        placeholder='Type your guess here'
        onKeyDown={sendChat}
      />
    </div>
  );
};

export default Chat;
