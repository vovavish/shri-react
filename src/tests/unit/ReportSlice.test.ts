import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create, type StoreApi } from 'zustand';
import { createReportSlice, type ReportSlice } from '../../store/ReportStore';
import { ReportService } from '../../services/ReportService';
import type { Report, SavedReport } from '../../types/Report';

describe('Тестирование слайса отчетов (ReportSlice)', () => {
  let useStore: StoreApi<ReportSlice>;
  const mockReport: Report = {
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
  const mockSavedReport: SavedReport = {
    id: '1',
    report: mockReport,
    date: '2025-06-27',
    isFailed: false,
    fileName: 'test1.csv',
  };

  beforeEach(() => {
    useStore = create<ReportSlice>((set, get, api) => ({
      ...createReportSlice(set, get, api),
    }));
  });

  test('csv файл устанавливается', () => {
    const { setCsvFile } = useStore.getState();
    const file = new File([], 'test1.csv');

    setCsvFile(file);

    expect(useStore.getState().csvFile).toBe(file);
  });

  test('ошибка загрузки при агрегации устанавливается', () => {
    const { setIsReportError } = useStore.getState();

    setIsReportError(true);

    expect(useStore.getState().isReportError).toBe(true);
  });

  test('при успешной агрегации отчета сохраняется отчет в состоянии', () => {
    const { aggregateReport } = useStore.getState();
    const file = new File([], 'test1.csv');
    const rows = 100;

    ReportService.aggregateReport = vi
      .fn()
      .mockImplementation((_file, _rows, onData, onSuccess, _onError) => {
        onData(mockReport);
        onSuccess?.();
      });

    aggregateReport(file, rows);

    expect(useStore.getState().currentReport).toEqual(mockReport);
  });

  test('при ошибке при агрегации отчета устанавливается ошибка', () => {
    const { aggregateReport } = useStore.getState();
    const file = new File([], 'test1.csv');
    const rows = 100;

    ReportService.aggregateReport = vi
      .fn()
      .mockImplementation((_file, _rows, _onData, _onSuccess, onError) => {
        onError?.();
      });

    aggregateReport(file, rows);

    expect(useStore.getState().isReportError).toBe(true);
  });

  test('происходит сброс отчета', () => {
    useStore.setState({
      currentReport: mockReport,
      isReportError: true,
      isReportSuccess: true,
      isReportLoading: true,
    });
    const { resetReport } = useStore.getState();

    resetReport();

    expect(useStore.getState().currentReport).toBe(null);
    expect(useStore.getState().isReportError).toBe(false);
    expect(useStore.getState().isReportSuccess).toBe(false);
    expect(useStore.getState().isReportLoading).toBe(false);
  });

  test('происходит сброс отчета генерации', () => {
    useStore.setState({
      isReportGenerating: true,
      isReportGeneratingError: true,
      isReportGeneratingSuccess: true,
    });
    const { resetReportGenerating } = useStore.getState();

    resetReportGenerating();

    expect(useStore.getState().isReportGenerating).toBe(false);
    expect(useStore.getState().isReportGeneratingError).toBe(false);
    expect(useStore.getState().isReportGeneratingSuccess).toBe(false);
  });

  test('при успешной генерации отчета устанавливается флаг success', () => {
    const { getReport } = useStore.getState();

    ReportService.getReport = vi.fn().mockImplementation((onSuccess, _onError) => {
      onSuccess?.();
    });

    getReport();

    expect(useStore.getState().isReportGeneratingSuccess).toBe(true);
    expect(useStore.getState().isReportGeneratingError).toBe(false);
  });

  test('при ошибке генерации отчета устанавливается флаг error', () => {
    const { getReport } = useStore.getState();

    ReportService.getReport = vi.fn().mockImplementation((_onSuccess, onError) => {
      onError?.();
    });

    getReport();

    expect(useStore.getState().isReportGeneratingError).toBe(true);
    expect(useStore.getState().isReportGeneratingSuccess).toBe(false);
  });

  test('при загрузке отчетов они сохраняются в состоянии', () => {
    const { loadSavedReports } = useStore.getState();

    ReportService.getReports = vi
      .fn()
      .mockImplementation(() => [mockReport, mockReport, mockReport]);

    loadSavedReports();

    expect(useStore.getState().savedReports).toEqual([mockReport, mockReport, mockReport]);
  });

  test('при очистке отчетов они удаляются из состояния', () => {
    const { clearSavedReports } = useStore.getState();

    ReportService.clearReports = vi.fn();

    clearSavedReports();

    expect(useStore.getState().savedReports).toEqual([]);
    expect(ReportService.clearReports).toBeCalled();
  });

  test('при удалении отчета по Id он удаляется из состояния', () => {
    const initialReports = [
      { ...mockSavedReport, id: '1' },
      { ...mockSavedReport, id: '2' },
    ];
    const reportsAfterRemove = [{ ...mockSavedReport, id: '2' }];

    useStore.setState({
      savedReports: initialReports,
    });

    ReportService.removeReportById = vi.fn();
    ReportService.getReports = vi.fn().mockImplementation(() => reportsAfterRemove);

    const { removeReportById } = useStore.getState();

    removeReportById('1');

    expect(useStore.getState().savedReports).toEqual(reportsAfterRemove);
    expect(ReportService.removeReportById).toBeCalledWith('1');
  });
});
