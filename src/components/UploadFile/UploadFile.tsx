import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { ButtonUpload, type ButtonUploadProps } from '../ui/ButtonUpload';

import styles from './UploadFile.module.css';
import { useStore } from '../../store';

interface UploadFileProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export const UploadFile = ({ selectedFile, setSelectedFile }: UploadFileProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [buttonVariant, setButtonVariant] = useState<ButtonUploadProps['variant']>('initial');

  const dragCounter = useRef(0);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const resetReport = useStore((store) => store.resetReport);
  const isReportLoading = useStore((store) => store.isReportLoading);
  const isReportError = useStore((store) => store.isReportError);
  const isReportSuccess = useStore((store) => store.isReportSuccess);

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
  }, [isReportLoading, isReportError, isReportSuccess]);

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter.current++;

    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragOver(true);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter.current = 0;

    setIsDragOver(false);

    if (!event.dataTransfer.files[0]) {
      return;
    }

    setSelectedFile(event.dataTransfer.files[0]);
    setButtonVariant('loaded');
  };

  return (
    <label
      className={classNames(styles.file_label, {
        [styles.file_label_uploaded]: selectedFile,
        [styles.file_label_choosing]: !selectedFile && isDragOver,
        [styles.file_label_base]: !selectedFile && !isDragOver,
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
          console.log('event.target.files', event.target.files);
          if (event.target.files?.[0]) {
            setSelectedFile(event.target.files?.[0]);
            setButtonVariant('loaded');
            return;
          }

          setSelectedFile(null);
        }}
        ref={inputFileRef}
      />
      <ButtonUpload
        selectedFileName={selectedFile?.name}
        onClearClick={() => {
          setSelectedFile(null);

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
