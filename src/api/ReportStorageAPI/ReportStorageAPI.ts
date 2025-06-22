import type { Report, SavedReport } from '../../types/Report';

const STORAGE_KEY = 'reports';

export const ReportStorageAPI = {
  saveReport: (report: Report, fileName: string, isFailed: boolean) => {
    const reports = localStorage.getItem(STORAGE_KEY);

    const currentDate = new Date();

    const dateToSave = currentDate.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const reportToSave: SavedReport = {
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      report,
      fileName,
      isFailed,
      date: dateToSave,
    };

    if (reports) {
      const reportsArray = JSON.parse(reports);
      reportsArray.push(reportToSave);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reportsArray));
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify([reportToSave]));
  },

  getReports: (): SavedReport[] => {
    const reports = localStorage.getItem(STORAGE_KEY);
    return reports ? JSON.parse(reports).reverse() : [];
  },

  clearReports: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  removeReportById: (id: string) => {
    const reports = localStorage.getItem(STORAGE_KEY);

    if (reports) {
      const reportsArray = JSON.parse(reports);
      const filteredReports = reportsArray.filter(
        (savedReport: SavedReport) => savedReport.id !== id,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredReports));
    }
  },
};
