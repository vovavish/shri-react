import styles from './BoldText.module.css';

interface BoldTextProps {
  children: React.ReactNode;
}

export const BoldText = ({ children }: BoldTextProps) => {
  return <span className={styles.bold_text}>{children}</span>;
};
