import classNames from 'classnames';

import clear from '../../../assets/clear.svg';

import styles from './ButtonClear.module.css';

interface ButtonClearProps {
  onClick?: () => void;
  className?: string;
}

export const ButtonClear = ({ onClick, className, ...rest }: ButtonClearProps) => {
  return (
    <button {...rest} className={classNames(styles.button_clear, className)} onClick={onClick} type="button">
      <img src={clear} />
    </button>
  );
};
