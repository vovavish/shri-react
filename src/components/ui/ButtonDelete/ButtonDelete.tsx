import trash from '../../../assets/Trash.svg';

import styles from './ButtonDelete.module.css';

interface ButtonDeleteProps {
  onClick?: () => void;
}

export const ButtonDelete = ({ onClick, ...rest }: ButtonDeleteProps) => {
  return (
    <button {...rest} className={styles.button_delete} onClick={onClick}>
      <img src={trash} alt="Удалить" />
    </button>
  );
};
