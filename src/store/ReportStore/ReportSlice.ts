import type { StateCreator } from 'zustand';

import { ReportService } from '../../services/ReportService';
import type { Report, SavedReport } from '../../types/Report';

export interface ReportSlice {
  csvFile: File | null;
  currentReport: Report | null;
  isReportLoading: boolean;
  isReportError: boolean;
  isReportSuccess: boolean;

  isReportGenerating: boolean;
  isReportGeneratingError: boolean;
  isReportGeneratingSuccess: boolean;

  savedReports: SavedReport[];

  setCsvFile: (file: File | null) => void;
  setIsReportError: (isReportError: boolean) => void;
  aggregateReport: (file: File, rows: number) => void;
  resetReport: () => void;
  resetReportGenerating: () => void;
  getReport: () => void;
  loadSavedReports: () => void;
  clearSavedReports: () => void;
  removeReportById: (id: string) => void;
}

export const createReportSlice: StateCreator<ReportSlice> = (set, get) => ({
  csvFile: null,
  currentReport: null,
  isReportLoading: false,
  isReportError: false,
  isReportSuccess: false,

  isReportGenerating: false,
  isReportGeneratingError: false,
  isReportGeneratingSuccess: false,

  savedReports: [],

  setCsvFile: (file) => set({ csvFile: file }),
  setIsReportError: (isReportError) => set({ isReportError: isReportError }),

  aggregateReport: (file, rows) => {
    set({ isReportLoading: true });
    ReportService.aggregateReport(
      file,
      rows,
      (data: Report) => set({ currentReport: data }),
      () => {
        set({ isReportLoading: false, isReportSuccess: true });
        ReportService.saveReport(get().currentReport as Report, get().csvFile?.name || '', false);
      },
      () => {
        set({ isReportError: true });
        ReportService.saveReport(get().currentReport as Report, get().csvFile?.name || '', true);
      },
    );
  },

  resetReport: () => {
    set({
      currentReport: null,
      isReportLoading: false,
      isReportError: false,
      isReportSuccess: false,
    });
  },

  resetReportGenerating: () => {
    set({
      isReportGenerating: false,
      isReportGeneratingError: false,
      isReportGeneratingSuccess: false,
    });
  },

  getReport: async () => {
    set({ isReportGenerating: true });
    await ReportService.getReport(
      () => set({ isReportGeneratingSuccess: true }),
      () => set({ isReportGeneratingError: true }),
    );
    set({ isReportGenerating: false });
  },

  loadSavedReports: () => {
    set({ savedReports: ReportService.getReports() });
  },

  clearSavedReports: () => {
    ReportService.clearReports();
    set({ savedReports: [] });
  },

  removeReportById: (id: string) => {
    ReportService.removeReportById(id);
    set({ savedReports: ReportService.getReports() });
  },
});
