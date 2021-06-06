import PropType from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendOnCanvasClear,
  sendRoomDrawingInfo,
} from '../../store/actions/room';
import Palette from '../Palette/Palette';
import styles from './DrawingBoard.module.css';

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

const DrawingBoard = ({ show }) => {
  const canvasRef = useRef(null);
  const [current, setCurrent] = useState({
    color: 'black',
    x: 0,
    y: 0,
    thickness: 2,
  });
  const [drawing, setDrawing] = useState(false);
  const [canvasOriginalSize, setCanvasOriginalSize] = useState({
    width: 0,
    height: 0,
  }); // used for canvas redrawing on window resize
  const [canvasCurrentSize, setCanvasCurrentSize] = useState({
    width: 0,
    height: 0,
  });
  const [ctx, setCtx] = useState(null);
  const drawingInfo = useSelector((state) => state.room.drawingInfo);
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const [lines, setLines] = useState([]);
  const clearCanvas = useSelector((state) => state.room.room.clearCanvas);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasOriginalSize({ width: canvas.width, height: canvas.height });
    setCanvasCurrentSize({ width: canvas.width, height: canvas.height });
    setCtx(canvas.getContext('2d'));
  }, []);

  const drawLine = (
    x0,
    y0,
    x1,
    y1,
    color,
    thickness,
    emit,
    drawingCanvasInfo,
    isCurrentPlayerDrawing
  ) => {
    setLines([...lines, { x0, y0, x1, y1, color, thickness }]);

    if (!ctx) {
      setCtx(canvasRef.current.getContext('2d'));
      return;
    }

    if (drawingCanvasInfo && !isCurrentPlayerDrawing) {
      ctx.scale(
        canvasCurrentSize.width / drawingCanvasInfo.width,
        canvasCurrentSize.height / drawingCanvasInfo.height
      );
    }

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineJoin = 'round';
    ctx.closePath();
    ctx.stroke();

    if (drawingCanvasInfo && !isCurrentPlayerDrawing) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    if (!emit) {
      return;
    }

    dispatch(
      sendRoomDrawingInfo({
        x0,
        y0,
        x1,
        y1,
        color,
        thickness,
        drawingCanvasInfo,
      })
    );
  };

  useEffect(() => {
    if (windowSize) {
      // const canvas = canvasRef.current;

      // // draw on a temp canvas
      // let tempCanvas = document.createElement('canvas');
      // let tempCtx = tempCanvas.getContext('2d');
      // tempCanvas.width = canvasSize.width;
      // tempCanvas.height = canvasSize.height;
      // tempCtx.drawImage(canvas, 0, 0);

      // canvas.width = canvas.offsetWidth;
      // canvas.height = canvas.offsetHeight;
      // const ctx = canvas.getContext('2d');

      // ctx.drawImage(
      //   tempCanvas,
      //   0,
      //   0,
      //   tempCanvas.width,
      //   tempCanvas.height,
      //   0,
      //   0,
      //   canvas.width,
      //   canvas.height
      // );

      // setCanvasSize({ width: canvas.width, height: canvas.height });
      // setCtx(ctx);

      // tempCanvas = null;
      // tempCtx = null;

      const originalCanvasWidth = canvasOriginalSize.width;
      const originalCanvasHeight = canvasOriginalSize.height;

      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');

      const xScale = canvas.width / originalCanvasWidth;
      const yScale = canvas.height / originalCanvasHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(xScale, yScale);

      for (const line of lines) {
        drawLine(
          line.x0,
          line.y0,
          line.x1,
          line.y1,
          line.color,
          line.thickness,
          false
        );
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      setCanvasCurrentSize({ width: canvas.width, height: canvas.height });
      setCtx(ctx);
    }
  }, [windowSize, canvasOriginalSize, lines]);

  // const onColorUpdate = (color) => {
  //   setCurrent({
  //     ...current,
  //     color: color,
  //   });
  // };
  const onCanvasClear = (emit) => {
    if (!ctx) {
      setCtx(canvasRef.current.getContext('2d'));
      return;
    }

    const oldStyle = ctx.fillStyle;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setLines([]);

    ctx.fillStyle = oldStyle;

    if (emit) {
      dispatch(sendOnCanvasClear());
    }
  };

  useEffect(() => {
    if (drawingInfo) {
      drawLine(
        drawingInfo.x0,
        drawingInfo.y0,
        drawingInfo.x1,
        drawingInfo.y1,
        drawingInfo.color,
        drawingInfo.thickness,
        false,
        drawingInfo.drawingCanvasInfo
      );
    }
  }, [drawingInfo]);

  useEffect(() => {
    if (clearCanvas && clearCanvas.action) {
      onCanvasClear();
    }
  }, [clearCanvas]);

  const onPaletteUpdate = (type, val) => {
    if (type === 'color') {
      setCurrent({
        ...current,
        color: val,
      });
    } else if (type === 'thickness') {
      setCurrent({
        ...current,
        thickness: val,
      });
    } else {
      setCurrent({
        ...current,
        color: 'white',
        thickness: val,
      });
    }
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

    drawLine(
      current.x,
      current.y,
      x,
      y,
      current.color,
      current.thickness,
      true,
      canvasCurrentSize,
      true
    );
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

    drawLine(
      current.x,
      current.y,
      x,
      y,
      current.color,
      current.thickness,
      true,
      canvasCurrentSize,
      true
    );

    setCurrent({
      ...current,
      x,
      y,
    });
  };

  return (
    <Row>
      <Col md='11'>
        <div
          style={
            show
              ? {
                  height: 'calc(100vh - 80px - 60px)',
                  border: '1px solid black',
                  marginLeft: 20,
                }
              : {
                  pointerEvents: 'none',
                  opacity: '0.4',
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
        </div>
      </Col>
      <Col md='1'>
        <div
          style={
            show
              ? null
              : {
                  pointerEvents: 'none',
                  opacity: '0.4',
                }
          }
        >
          <Palette
            onPaletteUpdate={onPaletteUpdate}
            onCanvasClear={onCanvasClear}
          />
        </div>
        {/* <div className={styles.colors}>
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
        </div> */}
      </Col>
    </Row>
  );
};

DrawingBoard.propTypes = {
  show: PropType.bool,
};

export default DrawingBoard;
