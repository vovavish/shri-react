import { useStore } from '../../store';

import { HighlightsBase } from '../HighlightsBase';

import styles from './Highlights.module.css';

export const Highlights = () => {
  const currentReport = useStore((store) => store.currentReport);
  const isReportError = useStore((store) => store.isReportError);

  if (!currentReport || isReportError) {
    return (
      <div className={styles.empty_container}>
        <div>Здесь</div>
        <div>появятся хайлайты</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <HighlightsBase
        report={currentReport}
        order={[
          'total_spend_galactic',
          'less_spent_civ',
          'rows_affected',
          'big_spent_at',
          'less_spent_at',
          'big_spent_value',
          'big_spent_civ',
          'average_spend_galactic',
        ]}
        variant="white"
      />
    </div>
  );
};
