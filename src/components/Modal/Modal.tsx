import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ButtonClear } from '../ui/ButtonClear';

import styles from './Modal.module.css';

interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isModalOpen, onClose, children }: ModalProps) => {
  const modalRoot = document.getElementById('modal');

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  if (!isModalOpen || !modalRoot) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <ButtonClear onClick={onClose} className={styles.close_button}></ButtonClear>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    modalRoot,
  );
};
