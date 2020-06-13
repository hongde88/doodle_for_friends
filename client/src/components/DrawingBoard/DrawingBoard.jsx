import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './DrawingBoard.module.css';
import { sendRoomDrawingInfo } from '../../store/actions/room';

const useWindowSize = () => {
  const [size, setSize] = useState(null);

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
};

const DrawingBoard = ({ disabled }) => {
  const canvasRef = useRef(null);
  const [current, setCurrent] = useState({ color: 'black', x: 0, y: 0 });
  const [drawing, setDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [ctx, setCtx] = useState(null);
  const drawingInfo = useSelector((state) => state.room.drawingInfo);
  const dispatch = useDispatch();
  const windowSize = useWindowSize();

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasSize({ width: canvas.width, height: canvas.height });
    setCtx(canvas.getContext('2d'));
  }, []);

  useEffect(() => {
    if (windowSize) {
      const canvas = canvasRef.current;

      // draw on a temp canvas
      let tempCanvas = document.createElement('canvas');
      let tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvasSize.width;
      tempCanvas.height = canvasSize.height;
      tempCtx.drawImage(canvas, 0, 0);

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        tempCanvas,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      setCanvasSize({ width: canvas.width, height: canvas.height });
      setCtx(ctx);

      tempCanvas = null;
      tempCtx = null;
    }
  }, [windowSize]);

  useEffect(() => {
    if (drawingInfo) {
      drawLine(
        drawingInfo.x0,
        drawingInfo.y0,
        drawingInfo.x1,
        drawingInfo.y1,
        drawingInfo.color
      );
    }
  }, [drawingInfo]);

  const drawLine = (x0, y0, x1, y1, color, emit) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    if (!emit) {
      return;
    }

    dispatch(sendRoomDrawingInfo({ x0, y0, x1, y1, color }));
  };

  const onColorUpdate = (color) => {
    setCurrent({
      ...current,
      color: color,
    });
  };

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function () {
      const time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  const getRelativeCoordinates = (x, y, rect) => {
    return {
      x: Math.floor(x - rect.left),
      y: Math.floor(y - rect.top),
    };
  };

  const onMouseDown = (e) => {
    const { x, y } = getRelativeCoordinates(
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      e.target.getBoundingClientRect()
    );

    setDrawing(true);

    setCurrent({
      ...current,
      x,
      y,
    });
  };

  const onMouseUp = (e) => {
    if (!drawing) {
      return;
    }
    setDrawing(false);

    const { x, y } = getRelativeCoordinates(
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      e.target.getBoundingClientRect()
    );

    drawLine(current.x, current.y, x, y, current.color, true);
  };

  const onMouseMove = (e) => {
    if (!drawing) {
      return;
    }

    const { x, y } = getRelativeCoordinates(
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      e.target.getBoundingClientRect()
    );

    drawLine(current.x, current.y, x, y, current.color, true);

    setCurrent({
      ...current,
      x,
      y,
    });
  };

  return (
    <div
      style={
        disabled
          ? {
              pointerEvents: 'none',
              opacity: '0.4',
              height: 'calc(100vh - 80px - 60px)',
              border: '1px solid black',
              marginLeft: 20,
            }
          : {
              height: 'calc(100vh - 80px - 60px)',
              border: '1px solid black',
              marginLeft: 20,
            }
      }
    >
      <canvas
        className={styles.whiteboard}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseUp}
        onMouseMove={throttle(onMouseMove, 50)}
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
        onTouchCancel={onMouseUp}
        onTouchMove={throttle(onMouseMove, 50)}
      />
      <div className={styles.colors}>
        <div
          className={`${styles.color} ${styles.black}`}
          onClick={() => onColorUpdate('black')}
        ></div>
        <div
          className={`${styles.color} ${styles.red}`}
          onClick={() => onColorUpdate('red')}
        ></div>
        <div
          className={`${styles.color} ${styles.green}`}
          onClick={() => onColorUpdate('green')}
        ></div>
        <div
          className={`${styles.color} ${styles.blue}`}
          onClick={() => onColorUpdate('blue')}
        ></div>
        <div
          className={`${styles.color} ${styles.orange}`}
          onClick={() => onColorUpdate('orange')}
        ></div>
        <div
          className={`${styles.color} ${styles.yellow}`}
          onClick={() => onColorUpdate('yellow')}
        ></div>
        <div
          className={`${styles.color} ${styles.purple}`}
          onClick={() => onColorUpdate('purple')}
        ></div>
      </div>
    </div>
  );
};

export default DrawingBoard;
