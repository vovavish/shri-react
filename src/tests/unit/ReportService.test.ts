import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ReportService } from '../../services/ReportService';
import { ReportAPI } from '../../api/ReportApi';
import type { Report } from '../../types/Report';

vi.mock('../../api/ReportApi', () => ({
  ReportAPI: {
    getReport: vi.fn(),
    aggregate: vi.fn(),
  },
}));

describe('Тестирование сервиса отчетов (ReportService)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  describe('получение отчета (getReport)', () => {
    let mockGetReport = vi.mocked(ReportAPI.getReport);

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    test('при успешном получении отчета вызывается onSuccess', async () => {
      const mockBlob = new Blob(['content'], { type: 'text/csv' });
      const mockResponse = Promise.resolve(
        new Response(mockBlob, {
          status: 200,
          headers: { 'Content-Type': 'text/csv' },
        }),
      );

      mockGetReport.mockReturnValue(mockResponse);

      Object.defineProperty(window.URL, 'createObjectURL', {
        writable: true,
        value: vi.fn(() => 'mock-url'),
      });
      Object.defineProperty(window.URL, 'revokeObjectURL', {
        writable: true,
        value: vi.fn(),
      });

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ReportService.getReport(onSuccess, onError);

      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    test('при неудачном получении отчета вызывается onError', async () => {
      const mockBlob = new Blob(['content'], { type: 'text/csv' });
      const mockResponse = Promise.reject(
        new Response(mockBlob, {
          status: 500,
          headers: { 'Content-Type': 'text/csv' },
        }),
      );

      mockGetReport.mockReturnValue(mockResponse);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ReportService.getReport(onSuccess, onError);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });

    test('при ошибке вызывается onError', async () => {
      mockGetReport.mockRejectedValue(new Error('Network error'));

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ReportService.getReport(onSuccess, onError);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('получение агрегированного отчета (aggregateReport)', () => {
    let mockAggregate = vi.mocked(ReportAPI.aggregate);

    let onData = vi.fn();
    let onError = vi.fn();
    let onSuccess = vi.fn();

    beforeEach(() => {
      onData = vi.fn();
      onError = vi.fn();
      onSuccess = vi.fn();
    });

    const mockReport = {
      total_spend_galactic: 100,
      rows_affected: 100,
      less_spent_at: 100,
      big_spent_at: 100,
      less_spent_value: 100,
      big_spent_value: 100,
      average_spend_galactic: 100,
      big_spent_civ: 'humans',
      less_spent_civ: 'blobs',
    };

    test('при успешном получении отчета вызывается onData и onSuccess', async () => {
      const chunks = [
        JSON.stringify(mockReport) + '\n',
        JSON.stringify(mockReport) + '\n',
        JSON.stringify(mockReport) + '\n',
      ];

      const reader = {
        read: vi.fn().mockImplementation(() => {
          const chunk = chunks.shift();
          if (chunk) {
            return Promise.resolve({ value: new TextEncoder().encode(chunk), done: false });
          }
          return Promise.resolve({ done: true });
        }),
        cancel: vi.fn(),
      };

      mockAggregate.mockReturnValue(reader as any);

      vi.spyOn(ReportService, 'isValidReport').mockReturnValue(true);

      await ReportService.aggregateReport(new File([], ''), 100, onData, onSuccess, onError);

      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(onData).toHaveBeenCalledTimes(3);
    });

    test('если сервер вернул ошибку, вызывается onError', async () => {
      mockAggregate.mockRejectedValue(new Error('Network error'));

      await ReportService.aggregateReport(new File([], ''), 100, onData, onSuccess, onError);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });

    test('если reader возвращает ошибку, вызывается onError', async () => {
      const reader = {
        read: vi.fn().mockImplementation(() => new Error('Reader error')),
        cancel: vi.fn(),
      };

      mockAggregate.mockReturnValue(reader as any);

      vi.spyOn(ReportService, 'isValidReport').mockReturnValue(true);

      await ReportService.aggregateReport(new File([], ''), 100, onData, onSuccess, onError);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
      expect(onData).toHaveBeenCalledTimes(0);
    });

    test('если отчет невалиден, вызывается onError и reader отменяется', async () => {
      const chunks = [
        JSON.stringify(mockReport) + '\n',
        JSON.stringify(mockReport) + '\n',
        JSON.stringify(mockReport) + '\n',
      ];

      const reader = {
        read: vi.fn().mockImplementation(() => {
          const chunk = chunks.shift();
          if (chunk) {
            return Promise.resolve({ value: new TextEncoder().encode(chunk), done: false });
          }
          return Promise.resolve({ done: true });
        }),
        cancel: vi.fn(),
      };

      mockAggregate.mockReturnValue(reader as any);

      vi.spyOn(ReportService, 'isValidReport').mockReturnValue(false);

      const onData = vi.fn();
      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ReportService.aggregateReport(new File([], ''), 100, onData, onSuccess, onError);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
      expect(reader.cancel).toHaveBeenCalled();
    });
  });

  describe('Проверка валидности отчета', () => {
    test('При валиданом отчете возвращается true', () => {
      const report: Report = {
        total_spend_galactic: 100,
        rows_affected: 100,
        less_spent_at: 100,
        big_spent_at: 100,
        less_spent_value: 100,
        big_spent_value: 100,
        average_spend_galactic: 100,
        big_spent_civ: 'humans',
        less_spent_civ: 'blobs',
      };

      expect(ReportService.isValidReport(report)).toBe(true);
    });

    test('При невалидном отчете возвращается false', () => {
      const report = {
        total_spend_galactic: 100,
        rows_affected: 100,
        less_spent_at: 100,
        big_spent_at: null,
        less_spent_value: 100,
        big_spent_value: 100,
        average_spend_galactic: null,
        big_spent_civ: 'humans',
        less_spent_civ: 'blobs',
      } as unknown as Report;

      expect(ReportService.isValidReport(report)).toBe(false);
    });
  });

  describe('Проверка получения дня месяца по дню в году', () => {
    test('При валидном дне в году возвращается день месяца', () => {
      expect(ReportService.getDayOfMonthFromReportDayOfYear(10)).toStrictEqual({
        day: 11,
        month: 'января',
      });
    });
  });

  describe('Проверка получения имени месяца', () => {
    test('При валидном номере месяца возвращается имя месяца', () => {
      expect(ReportService.getMonthName(1)).toBe('января');
    });

    test('При невалидном номере месяца возвращается пустая строка', () => {
      expect(ReportService.getMonthName(-10)).toBe('');
    });
  });
});
