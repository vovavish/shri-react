import classNames from 'classnames';

import { Spinner } from '../Spinner';
import { ButtonClear } from '../ButtonClear';

import styles from './ButtonUpload.module.css';

export interface ButtonUploadProps {
  selectedFileName?: string;
  onClearClick?: () => void;
  variant: 'initial' | 'loaded' | 'loading' | 'success' | 'error';
  inputFileRef?: React.RefObject<HTMLInputElement | null>;
}

const message: Record<ButtonUploadProps['variant'], string> = {
  initial: 'или перетащите сюда',
  loaded: 'файл загружен!',
  loading: 'идёт парсинг файла',
  success: 'готово!',
  error: 'упс, не то...',
};

export const ButtonUpload = ({
  selectedFileName,
  onClearClick,
  variant = 'initial',
  inputFileRef,
}: ButtonUploadProps) => {
  return (
    <div>
      <div data-variant={variant} className={styles.button_upload__wrapper}>
        <div
          className={classNames(styles.button_upload, styles[variant])}
          onClick={() => {
            if (variant === 'initial') {
              inputFileRef?.current?.click();
            }
          }}
        >
          {variant === 'initial' ? (
            'Загрузить файл'
          ) : variant === 'loading' ? (
            <Spinner />
          ) : (
            selectedFileName
          )}
        </div>
        {['loaded', 'success', 'error'].includes(variant) && <ButtonClear data-testid="button-clear" onClick={onClearClick} />}
      </div>
      <div className={classNames(styles.message, variant === 'error' ? styles.error_message : {})}>
        {message[variant]}
      </div>
    </div>
  );
};
