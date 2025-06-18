import { ReportAPI } from '../../api/ReportAPI';
import type { Report } from '../../types/Report';

export const ReportService = {
  getReport: async (onSuccess?: () => void, onError?: () => void) => {
    try {
      const response = await ReportAPI.getReport(0.5, 'on', 1000);

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
    } catch (error) {
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
    const reader = await ReportAPI.aggregate(file, rows);

    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value);
      const aggregateJSON = JSON.parse(chunk) as Report;

      if (!ReportService.isValidReport(aggregateJSON)) {
        reader.cancel();
        onError?.();
        return;
      }

      onData(aggregateJSON);
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
    const date = new Date(2025, 0, 0);
    date.setDate(dayOfYear);
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

  saveReport: (report: Report, isFailed: boolean) => {
    const reports = localStorage.getItem('reports');

    if (reports) {
      const reportsArray = JSON.parse(reports);
      reportsArray.push({ report, isFailed });
      localStorage.setItem('reports', JSON.stringify(reportsArray));
      return;
    }

    localStorage.setItem('reports', JSON.stringify([{ report, isFailed }]));
  },

  getReports: () => {
    const reports = localStorage.getItem('reports');
    return reports ? JSON.parse(reports).reverse() : [];
  },
};
