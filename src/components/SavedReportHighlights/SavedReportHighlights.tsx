import { HighlightsBase } from '../HighlightsBase';

import type { Report } from '../../types/Report';

import styles from './SavedReportHighlights.module.css';

interface SavedReportHighlightsProps {
  report: Report;
}

export const SavedReportHighlights = ({ report }: SavedReportHighlightsProps) => {
  return (
    <div className={styles.container}>
      <HighlightsBase
        report={report}
        order={[
          'total_spend_galactic',
          'rows_affected',
          'less_spent_at',
          'less_spent_civ',
          'big_spent_civ',
          'big_spent_at',
          'big_spent_value',
          'average_spend_galactic',
        ]}
        variant="purple"
      />
    </div>
  );
};
