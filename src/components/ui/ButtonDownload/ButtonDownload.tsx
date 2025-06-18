import classNames from 'classnames';

import { Spinner } from '../Spinner';
import { ButtonClear } from '../ButtonClear';

import styles from './ButtonDownload.module.css';

export interface ButtonDownloadProps {
  onClick?: () => void;
  onClearClick?: () => void;
  variant: 'initial' | 'loading' | 'success' | 'error';
}

const message: Partial<Record<ButtonDownloadProps['variant'], string>> = {
  loading: 'идёт процесс генерации',
  success: 'файл сгенерирован!',
  error: 'упс, не то...',
};

const buttonText: Partial<Record<ButtonDownloadProps['variant'], string>> = {
  initial: 'Начать генерацию',
  success: 'Done!',
  error: 'Ошибка',
};

export const ButtonDownload = ({
  onClick,
  onClearClick,
  variant = 'initial',
}: ButtonDownloadProps) => {
  return (
    <div>
      <div className={styles.button_download__wrapper}>
        <div className={classNames(styles.button_download, styles[variant])} onClick={onClick}>
          {variant === 'loading' ? <Spinner /> : buttonText[variant]}
        </div>
        {['success', 'error'].includes(variant) && <ButtonClear onClick={onClearClick} />}
      </div>
      {message[variant] && (
        <div
          className={classNames(styles.message, variant === 'error' ? styles.error_message : {})}
        >
          {message[variant]}
        </div>
      )}
    </div>
  );
};
