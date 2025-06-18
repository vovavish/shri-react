import classNames from 'classnames';

import styles from './Title.module.css';

interface TitleProps {
  className?: string;
  children: React.ReactNode;
}

export const Title = ({ className, children }: TitleProps) => {
  return <div className={classNames(styles.page_title, className)}>{children}</div>;
};
