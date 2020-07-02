import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { sendMessageToRoom } from '../../store/actions/room';
import Axios from 'axios';
import YoutubeList from '../YoutubeList/YoutubeList';
import { useAudio } from '../Audio/Audio';
import styles from './Chat.module.css';

const Chat = () => {
  const dispatch = useDispatch();
  const currentMessage = useSelector((state) => state.room.currentMessage);
  const oldMessages = useSelector((state) => state.room.oldMessages);
  const username = useSelector((state) => state.user.user.name);
  const roomId = useSelector((state) => state.room.room.roomId);
  const [searches, setSearches] = useState([]);
  const [videoId, setVideoId] = useState(null);
  const playWinAudio = useAudio('/sounds/win.wav').playAudio;

  useEffect(() => {
    if (currentMessage) {
      if (currentMessage.correctGuess) {
        playWinAudio(true);
      }
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
    if (e.keyCode === 13) {
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

  const searchSong = async (e) => {
    if (e.keyCode === 13) {
      const message = e.target.value.trim();
      e.target.value = '';
      e.target.focus();
      if (message.length !== 0) {
        try {
          const searches = await Axios.post(
            process.env.SERVER_URL
              ? `${process.env.SERVER_URL}/search`
              : 'http://localhost:5001/search',
            {
              search: message,
            }
          );
          setSearches(searches.data);
        } catch (err) {
          console.error(err);
          setSearches([]);
        }
      }
    }
  };

  const onPlay = (id) => {
    setVideoId(id);
    setSearches([]);
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
      <div style={{ height: 'calc(50vh - 40px)' }}>
        <div
          className={styles.messages}
          style={{ height: 'calc(100% - 40px)' }}
          id='messageList'
        ></div>
        <Form.Control
          className='chat-input'
          type='text'
          placeholder='Type your guess here'
          onKeyDown={sendChat}
        />
      </div>
      <div style={{ paddingTop: '2px', height: 'calc(50vh - 40px)' }}>
        {searches.length > 0 ? (
          <YoutubeList searches={searches} onClick={onPlay} />
        ) : (
          <iframe
            title='just a song'
            style={{ height: 'calc(100% - 40px)', width: '100%' }}
            src={`https://www.youtube.com/embed/${
              videoId ? `${videoId}?autoplay=1` : '-fc4i-tF_jY?autoplay=0'
            }`}
            frameBorder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
          ></iframe>
        )}

        <Form.Control
          className='chat-input'
          type='text'
          placeholder='Search and play a song here'
          onKeyDown={searchSong}
        />
      </div>
    </div>
  );
};

export default Chat;
