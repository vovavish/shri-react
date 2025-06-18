import type { StateCreator } from 'zustand';
import { ReportService } from '../../services/ReportService';
import type { Report } from '../../types/Report';

export interface ReportSlice {
  currentReport: Report | null;
  isReportLoading: boolean;
  isReportError: boolean;
  isReportSuccess: boolean;

  isReportGenerating: boolean;
  isReportGeneratingError: boolean;
  isReportGeneratingSuccess: boolean;

  aggregateReport: (file: File, rows: number) => void;
  resetReport: () => void;
  getReport: () => void;
}

export const createReportSlice: StateCreator<ReportSlice> = (set, get, _api) => ({
  currentReport: null,
  isReportLoading: false,
  isReportError: false,
  isReportSuccess: false,

  isReportGenerating: false,
  isReportGeneratingError: false,
  isReportGeneratingSuccess: false,

  aggregateReport: (file, rows) => {
    set({ isReportLoading: true });
    ReportService.aggregateReport(
      file,
      rows,
      (data: Report) => set({ currentReport: data }),
      () => {
        set({ isReportLoading: false, isReportSuccess: true });
        ReportService.saveReport(get().currentReport as Report, false);
      },
      () => {
        set({ isReportError: true });
        ReportService.saveReport(get().currentReport as Report, true);
      },
    );
  },

  resetReport: () => {
    set({
      currentReport: null,
      isReportLoading: false,
      isReportError: false,
      isReportSuccess: false,
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
});
