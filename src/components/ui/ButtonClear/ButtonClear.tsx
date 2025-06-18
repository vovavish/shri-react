import clear from '../../../assets/clear.svg';

import styles from './ButtonClear.module.css';

interface ButtonClearProps {
  onClick?: () => void;
}

export const ButtonClear = ({ onClick }: ButtonClearProps) => {
  return (
    <button className={styles.button_clear} onClick={onClick} type="button">
      <img src={clear} />
    </button>
  );
};
