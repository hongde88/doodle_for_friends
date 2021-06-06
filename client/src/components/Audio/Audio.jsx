import { useState } from 'react';

export const useAudio = (path) => {
  const [audio] = useState(new Audio(path));

  const playAudio = (playing) => {
    if (playing) {
      audio.play();
    } else {
      audio.pause();
      audio.src = audio.src;
    }
  };

  return { audio, playAudio };
};
