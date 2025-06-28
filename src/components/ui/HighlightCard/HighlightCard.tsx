import classNames from 'classnames';

import { ReportService } from '../../../services/ReportService';
import styles from './HighlightCard.module.css';

export interface HighlightCardProps {
  value: string | number;
  description: string;
  isDayOfYear?: boolean;
  isNeedRound?: boolean;
  variant: 'white' | 'purple';
}

export const HighlightCard = ({
  value,
  description,
  isDayOfYear,
  isNeedRound,
  variant,
  ...rest
}: HighlightCardProps) => {
  let day = 0;
  let month = '';

  if (isDayOfYear) {
    const date = ReportService.getDayOfMonthFromReportDayOfYear(Number(value));
    day = date.day;
    month = date.month;
  }

  return (
    <div {...rest} className={classNames(styles.container, styles[variant])}>
      <div className={styles.value}>
        {isDayOfYear ? (
          <span>
            {day} {month}
          </span>
        ) : isNeedRound ? (
          Math.round(Number(value))
        ) : (
          value
        )}
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};
