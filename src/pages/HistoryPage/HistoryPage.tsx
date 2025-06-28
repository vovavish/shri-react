import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStore } from '../../store';

import { ReportsHistory } from '../../components/ReportsHistory';
import { Button } from '../../components/ui/Button';

import styles from './HistoryPage.module.css';

export const HistoryPage = () => {
  const navigate = useNavigate();

  const clearSavedReports = useStore((store) => store.clearSavedReports);
  const savedReports = useStore((store) => store.savedReports);
  const loadSavedReports = useStore((store) => store.loadSavedReports);

  useEffect(() => {
    loadSavedReports();
  }, [loadSavedReports]);

  return (
    <div className={styles.container} data-testid="history-page">
      {savedReports.length > 0 && <ReportsHistory />}
      <div className={styles.buttons}>
        <Button data-testid="button-generate-more" variant="send" onClick={() => navigate('/generator')}>
          Сгенерировать больше
        </Button>
        {savedReports.length > 0 && (
          <Button data-testid="button-clear" variant="clear" onClick={clearSavedReports}>
            Очистить всё
          </Button>
        )}
      </div>
    </div>
  );
};
