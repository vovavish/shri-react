import { ReportService } from '../../../services/ReportService';
import styles from './HighlightCard.module.css';

interface HighlightCardProps {
  value: string | number;
  description: string;
  isDayOfYear?: boolean;
}

export const HighlightCard = ({ value, description, isDayOfYear }: HighlightCardProps) => {
  let day = 0;
  let month = '';

  if (isDayOfYear) {
    const date = ReportService.getDayOfMonthFromReportDayOfYear(Number(value));
    day = date.day;
    month = date.month;
  }

  return (
    <div className={styles.container}>
      <div className={styles.value}>
        {isDayOfYear ? (
          <span>
            {day} {month}
          </span>
        ) : (
          value
        )}
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};
