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
  ...rest
}: ButtonDownloadProps) => {
  return (
    <div data-variant={variant}>
      <div className={styles.button_download__wrapper}>
        <button
          {...rest}
          className={classNames(styles.button_download, styles[variant])}
          onClick={onClick}
        >
          {variant === 'loading' ? <Spinner /> : buttonText[variant]}
        </button>
        {['success', 'error'].includes(variant) && (
          <ButtonClear data-testid="button-clear" onClick={onClearClick} />
        )}
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
