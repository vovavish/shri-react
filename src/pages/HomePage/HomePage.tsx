import { UploadCSVForm } from '../../components/UploadCSVForm';
import { Highlights } from '../../components/Highlights';

import styles from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <UploadCSVForm />
      <Highlights />
    </div>
  );
};
