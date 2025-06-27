import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import type { Report } from '../../types/Report';
import { ReportStorageAPI } from '../../api/ReportStorageAPI';
import { STORAGE_KEY } from '../../api/ReportStorageAPI';

describe('Тестирование хранилища отчетов (ReportStorageAPI)', () => {
  let mockReport: Report = {
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

  beforeAll(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test('отчет сохраняется в пустом хранилище', () => {
    ReportStorageAPI.saveReport(mockReport, 'test1.csv', false);

    const reports = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    expect(reports.length).toBe(1);
    expect(reports[0].fileName).toBe('test1.csv');
    expect(reports[0].isFailed).toBe(false);
    expect(reports[0].report).toEqual(mockReport);
  });

  test('второй отчет сохраняется в непустом хранилище', () => {
    ReportStorageAPI.saveReport(mockReport, 'test1.csv', false);
    ReportStorageAPI.saveReport(mockReport, 'test2.csv', true);

    const reports = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    expect(reports.length).toBe(2);
    expect(reports[1].fileName).toBe('test2.csv');
    expect(reports[1].isFailed).toBe(true);
    expect(reports[1].report).toEqual(mockReport);
  });

  test('возвращаются сохраненные отчеты в обратном порядке', () => {
    ReportStorageAPI.saveReport(mockReport, 'test1.csv', false);
    ReportStorageAPI.saveReport(mockReport, 'test2.csv', true);

    const reports = ReportStorageAPI.getReports();

    expect(reports.length).toBe(2);
    expect(reports[0].fileName).toBe('test2.csv');
    expect(reports[1].fileName).toBe('test1.csv');
  });

  test('возвращается пустой массив, если отчетов нет', () => {
    const reports = ReportStorageAPI.getReports();
    expect(reports.length).toBe(0);
  });

  test('хранилище отчетов очищается', () => {
    ReportStorageAPI.saveReport(mockReport, 'test1.csv', false);
    ReportStorageAPI.saveReport(mockReport, 'test2.csv', true);

    ReportStorageAPI.clearReports();
    const reports = ReportStorageAPI.getReports();

    expect(reports.length).toBe(0);
  });

  test('отчет удаляется по его Id', () => {
    ReportStorageAPI.saveReport(mockReport, 'test1.csv', false);
    ReportStorageAPI.saveReport(mockReport, 'test2.csv', true);

    const reportsBeforeRemove = ReportStorageAPI.getReports();
    const report2Id = reportsBeforeRemove[1].id;
    ReportStorageAPI.removeReportById(report2Id);
    const reportsAfterRemove = ReportStorageAPI.getReports();

    expect(reportsAfterRemove.length).toBe(1);
    expect(reportsAfterRemove[0].fileName).toBe('test2.csv');
  });

  test('отчет не удаляется, если его Id не найден', () => {
    ReportStorageAPI.saveReport(mockReport, 'test1.csv', false);
    ReportStorageAPI.saveReport(mockReport, 'test2.csv', true);

    const reportsBeforeRemove = ReportStorageAPI.getReports();
    const report2Id = reportsBeforeRemove[1].id;
    ReportStorageAPI.removeReportById(report2Id + '123');

    const reportsAfterRemove = ReportStorageAPI.getReports();
    expect(reportsAfterRemove.length).toBe(2);
  });
});
