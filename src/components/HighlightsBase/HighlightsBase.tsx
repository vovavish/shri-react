import { HighlightCard, type HighlightCardProps } from '../ui/HighlightCard';

import type { Report } from '../../types/Report';

const description: Partial<Record<keyof Report, string>> = {
  total_spend_galactic: 'общие расходы в галактических кредитах',
  less_spent_civ: 'цивилизация с минимальными расходами',
  rows_affected: 'количество обработанных записей',
  big_spent_at: 'день года с максимальными расходами',
  less_spent_at: 'день года с минимальными расходами',
  big_spent_value: 'максимальная сумма расходов за день',
  big_spent_civ: 'цивилизация с максимальными расходами',
  average_spend_galactic: 'средние расходы в галактических кредитах',
};

interface HighlightsBaseProps {
  report: Report;
  order: (keyof Report)[];
  variant: HighlightCardProps['variant'];
}

export const HighlightsBase = ({ report, order, variant }: HighlightsBaseProps) => {
  return (
    <>
      {order.map((key) => (
        <HighlightCard
          key={key}
          value={report[key as keyof Report]}
          description={description[key as keyof Report] || ''}
          isDayOfYear={key === 'big_spent_at' || key === 'less_spent_at'}
          variant={variant}
        />
      ))}
    </>
  );
};
