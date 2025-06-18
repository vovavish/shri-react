import { useStore } from '../../store';
import type { Report } from '../../types/Report';
import { HighlightCard } from '../ui/HighlightCard';

import styles from './Highlights.module.css';

const description: Partial<Record<keyof Report, string>> = {
  total_spend_galactic: 'общие расходы в галактических кредитах',
  less_spent_civ: 'цивилизация с минимальными расходами',
  rows_affected: 'количество обработанных записей',
  big_spent_at: 'день года с максимальными расходами',
  less_spent_at: 'день года с минимальными расходами',
  big_spent_value: 'максимальная сумма расходов за день',
  big_spent_civ: 'цивилизация с максимальными расходами',
  average_spend_galactic: ' средние расходы в галактических кредитах',
};

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
      {Object.entries(description).map(([key, value]) => (
        <HighlightCard
          key={key}
          value={currentReport[key as keyof Report]}
          description={value}
          isDayOfYear={key === 'big_spent_at' || key === 'less_spent_at'}
        />
      ))}
    </div>
  );
};
