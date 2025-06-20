import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { ButtonUpload, type ButtonUploadProps } from '../ui/ButtonUpload';

import styles from './UploadFile.module.css';
import { useStore } from '../../store';

export const UploadFile = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [buttonVariant, setButtonVariant] = useState<ButtonUploadProps['variant']>('initial');

  const dragCounter = useRef(0);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const resetReport = useStore((store) => store.resetReport);
  const isReportLoading = useStore((store) => store.isReportLoading);
  const isReportError = useStore((store) => store.isReportError);
  const isReportSuccess = useStore((store) => store.isReportSuccess);

  const csvFile = useStore((store) => store.csvFile);
  const setCsvFile = useStore((store) => store.setCsvFile);

  useEffect(() => {
    if (isReportError) {
      setButtonVariant('error');
      return;
    }

    if (isReportLoading) {
      setButtonVariant('loading');
      return;
    }

    if (isReportSuccess) {
      setButtonVariant('success');
      return;
    }

    setButtonVariant('initial');
  }, [isReportLoading, isReportError, isReportSuccess]);

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (buttonVariant !== 'initial') {
      return;
    }

    dragCounter.current++;

    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (buttonVariant !== 'initial') {
      return;
    }

    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (buttonVariant !== 'initial') {
      return;
    }

    setIsDragOver(true);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (buttonVariant !== 'initial') {
      return;
    }

    dragCounter.current = 0;

    setIsDragOver(false);

    if (!event.dataTransfer.files[0]) {
      return;
    }

    const file = event.dataTransfer.files[0];
    if (file.type !== 'text/csv') {
      return;
    }

    setCsvFile(event.dataTransfer.files[0]);
    setButtonVariant('loaded');
  };

  return (
    <label
      className={classNames(styles.file_label, {
        [styles.file_label_uploaded]: csvFile,
        [styles.file_label_choosing]: !csvFile && isDragOver,
        [styles.file_label_base]: !csvFile && !isDragOver,
        [styles.file_label_error]: isReportError,
      })}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      htmlFor=""
    >
      <input
        className={styles.file_label__input}
        type="file"
        accept=".csv"
        onChange={(event) => {
          if (event.target.files?.[0]) {
            setCsvFile(event.target.files?.[0]);
            setButtonVariant('loaded');
            return;
          }

          setCsvFile(null);
        }}
        ref={inputFileRef}
        disabled={buttonVariant !== 'initial'}
      />
      <ButtonUpload
        selectedFileName={csvFile?.name}
        onClearClick={() => {
          setCsvFile(null);

          if (inputFileRef.current) {
            inputFileRef.current.value = '';
          }

          setButtonVariant('initial');
          resetReport();
        }}
        variant={buttonVariant}
        inputFileRef={inputFileRef}
      />
    </label>
  );
};
