import spinner from '../../../assets/spinner.svg';

import styles from './Spinner.module.css';

export const Spinner = () => {
  return <img src={spinner} className={styles.spinner} />;
};
