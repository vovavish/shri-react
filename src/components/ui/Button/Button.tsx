import classNames from 'classnames';

import styles from './Button.module.css';

interface ButtonProps {
  className?: string;
  variant: 'send' | 'clear';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button = ({ className, variant, disabled, type, onClick, children }: ButtonProps) => {
  return (
    <button
      className={classNames(styles.button, styles[variant], className)}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
