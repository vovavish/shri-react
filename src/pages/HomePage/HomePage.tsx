import { UploadCSVForm } from '../../components/UploadCSVForm';
import { Highlights } from '../../components/Highlights';

import styles from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className={styles.container} data-testid="home-page">
      <UploadCSVForm />
      <Highlights />
    </div>
  );
};
