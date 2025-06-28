import { HighlightCard, type HighlightCardProps } from '../ui/HighlightCard';

import type { Report } from '../../types/Report';

const reportData: Partial<
  Record<keyof Report, { description: string; isDayOfYear?: boolean; isNeedRound?: boolean }>
> = {
  total_spend_galactic: {
    description: 'общие расходы в галактических кредитах',
    isNeedRound: true,
  },
  less_spent_civ: { description: 'цивилизация с минимальными расходами' },
  rows_affected: { description: 'количество обработанных записей' },
  big_spent_at: { description: 'день года с максимальными расходами', isDayOfYear: true },
  less_spent_at: { description: 'день года с минимальными расходами', isDayOfYear: true },
  big_spent_value: { description: 'максимальная сумма расходов за день', isNeedRound: true },
  big_spent_civ: { description: 'цивилизация с максимальными расходами' },
  average_spend_galactic: {
    description: 'средние расходы в галактических кредитах',
    isNeedRound: true,
  },
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
          description={reportData[key as keyof Report]?.description || ''}
          isDayOfYear={reportData[key as keyof Report]?.isDayOfYear}
          isNeedRound={reportData[key as keyof Report]?.isNeedRound}
          variant={variant}
          data-testid={`highlight-${key}`}
        />
      ))}
    </>
  );
};
