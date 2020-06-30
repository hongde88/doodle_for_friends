import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import Image from 'react-bootstrap/Image';
import styles from './Palette.module.css';
import PropType from 'prop-types';

const Palette = ({ onPaletteUpdate, onCanvasClear }) => {
  return (
    <div className={styles.colors}>
      <div
        className={`${styles.color} ${styles.black}`}
        onClick={() => onPaletteUpdate('color', 'black')}
      ></div>
      <div
        className={`${styles.color} ${styles.red}`}
        onClick={() => onPaletteUpdate('color', 'red')}
      ></div>
      <div
        className={`${styles.color} ${styles.green}`}
        onClick={() => onPaletteUpdate('color', 'green')}
      ></div>
      <div
        className={`${styles.color} ${styles.blue}`}
        onClick={() => onPaletteUpdate('color', 'blue')}
      ></div>
      <div
        className={`${styles.color} ${styles.orange}`}
        onClick={() => onPaletteUpdate('color', 'orange')}
      ></div>
      <div
        className={`${styles.color} ${styles.yellow}`}
        onClick={() => onPaletteUpdate('color', 'yellow')}
      ></div>
      <div
        className={`${styles.color} ${styles.purple}`}
        onClick={() => onPaletteUpdate('color', 'purple')}
      ></div>
      <div
        className={`${styles.thickness} ${styles.onepx}`}
        onClick={() => onPaletteUpdate('thickness', 2)}
      ></div>
      <div
        className={`${styles.thickness} ${styles.twopx}`}
        onClick={() => onPaletteUpdate('thickness', 5)}
      ></div>
      <div
        className={`${styles.thickness} ${styles.threepx}`}
        onClick={() => onPaletteUpdate('thickness', 10)}
      ></div>
      <div
        className={`${styles.thickness} ${styles.fourpx}`}
        onClick={() => onPaletteUpdate('thickness', 20)}
      ></div>
      <div className={`${styles.eraser}`}>
        <Image
          src={`/images/eraser.png`}
          onClick={() => onPaletteUpdate('erase', 15)}
        />
      </div>
      <div className={`${styles.clear}`} onClick={() => onCanvasClear(true)}>
        <DeleteIcon />
      </div>
    </div>
  );
};

Palette.propTypes = {
  onPaletteUpdate: PropType.func.isRequired,
  onCanvasClear: PropType.func.isRequired,
};

export default Palette;
