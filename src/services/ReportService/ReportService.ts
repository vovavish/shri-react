import { ReportAPI } from '../../api/ReportApi';
import { ReportStorageAPI } from '../../api/ReportStorageAPI';

import type { Report, SavedReport } from '../../types/Report';

export const ReportService = {
  getReport: async (onSuccess?: () => void, onError?: () => void) => {
    try {
      const response = await ReportAPI.getReport(0.01, 'on', 1000);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'report.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      onSuccess?.();
    } catch {
      onError?.();
    }
  },

  aggregateReport: async (
    file: File,
    rows: number,
    onData: (data: Report) => void,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    try {
      const reader = await ReportAPI.aggregate(file, rows);

      if (!reader) {
        throw new Error('No reader');
      }

      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const splittedChunk = chunk.split('\n').filter((item) => item);

        const aggregateJSON = JSON.parse(splittedChunk[splittedChunk.length - 1]) as Report;
        if (!ReportService.isValidReport(aggregateJSON)) {
          reader.cancel();
          throw new Error('Invalid report');
        }

        onData(aggregateJSON);
      }
    } catch {
      onError?.();
      return;
    }

    onSuccess?.();
  },

  isValidReport: (report: Report) => {
    for (const key in report) {
      if (report[key as keyof Report] === null) {
        return false;
      }
    }

    if (!report) {
      return false;
    }

    return true;
  },

  getDayOfMonthFromReportDayOfYear: (dayOfYear: number) => {
    const date = new Date(2025, 0, 1);
    date.setDate(date.getDate() + dayOfYear);
    return { day: date.getDate(), month: ReportService.getMonthName(date.getMonth() + 1) };
  },

  getMonthName: (month: number) => {
    const monthNamesGenitive = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

    return monthNamesGenitive[month - 1] || '';
  },

  saveReport: (report: Report, fileName: string, isFailed: boolean) => {
    ReportStorageAPI.saveReport(report, fileName, isFailed);
  },

  getReports: (): SavedReport[] => {
    return ReportStorageAPI.getReports();
  },

  clearReports: () => {
    ReportStorageAPI.clearReports();
  },

  removeReportById: (id: string) => {
    ReportStorageAPI.removeReportById(id);
  },
};
