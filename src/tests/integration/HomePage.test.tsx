import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import events from '@testing-library/user-event';
import { type ReportSlice } from '../../store/ReportStore';
import { useStore } from '../../store';
import '@testing-library/jest-dom';

import { HomePage } from '../../pages/HomePage';
import { act } from 'react';

vi.mock('../../store', async () => {
  const { create } = await import('zustand');
  const { createReportSlice } = await import('../../store/ReportStore');
  const store = create<ReportSlice>((set, get, api) => ({
    ...createReportSlice(set, get, api),
  }));
  return {
    useStore: store,
  };
});

describe('Тестирование страницы генерации отчета (GeneratorPage)', () => {
  const setCsvFileMock = vi.fn();
  const setIsReportErrorMock = vi.fn();
  const aggregateReportMock = vi.fn();
  const resetReportMock = vi.fn();

  const initStore = (overrides = {}) => {
    useStore.setState({
      csvFile: null,
      currentReport: null,
      isReportLoading: false,
      isReportError: false,
      isReportSuccess: false,
      setCsvFile: setCsvFileMock,
      setIsReportError: setIsReportErrorMock,
      aggregateReport: aggregateReportMock,
      resetReport: resetReportMock,
      ...overrides,
    });
  };
  beforeEach(() => {
    setCsvFileMock.mockClear();
    setIsReportErrorMock.mockClear();
    aggregateReportMock.mockClear();
    resetReportMock.mockClear();
    initStore();
  });

  test('при рендере страницы отображается заголовок, форма и кнопка отправки', () => {
    render(<HomePage />);

    const title = screen.getByTestId('title');
    const form = screen.getByTestId('form');
    const button = screen.getByTestId('button-send');

    expect(title).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('кнопка отправки отключена, если нет загруженного файла', () => {
    render(<HomePage />);

    const button = screen.getByTestId('button-send');

    expect(button).toBeDisabled();
  });

  test('кнопка отправки доступна, если есть загруженный файл', () => {
    initStore({
      csvFile: new File([], 'test1.csv'),
    });
    render(<HomePage />);

    const button = screen.getByTestId('button-send');

    expect(button).not.toBeDisabled();
  });

  test('при клике на кнопку отправки вызывается функция генерации отчета', async () => {
    initStore({
      csvFile: new File([], 'test1.csv'),
    });
    render(<HomePage />);

    const button = screen.getByTestId('button-send');

    await events.click(button);

    expect(aggregateReportMock).toHaveBeenCalledWith(useStore.getState().csvFile, 10000);
  });

  test('если загружен csv файл, то он сохраняется в состояние', async () => {
    render(<HomePage />);
    const file = new File([], 'test1.csv');
    const input = screen.getByTestId('input-file');

    await events.upload(input, file);

    expect(setCsvFileMock).toHaveBeenCalledWith(file);
  });

  test('при drag and drop некорректного файла устанавливается ошибка', async () => {
    render(<HomePage />);
    const file = new File([''], 'test1.txt', { type: 'text/plain' });
    const label = screen.getByTestId('label-file');

    const dataTransfer = {
      files: [file],
      types: ['Files'],
    };

    const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: dataTransfer,
    });

    await act(() => label.dispatchEvent(dropEvent));

    expect(setIsReportErrorMock).toHaveBeenCalledWith(true);
    expect(setCsvFileMock).toHaveBeenCalledWith(file);
  });

  test('при drag and drop корректного файла устанавливается успех', async () => {
    render(<HomePage />);
    const file = new File([''], 'test1.csv', { type: 'text/csv' });
    const label = screen.getByTestId('label-file');

    const dataTransfer = {
      files: [file],
      types: ['Files'],
    };

    const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: dataTransfer,
    });

    await act(() => label.dispatchEvent(dropEvent));

    expect(setIsReportErrorMock).not.toHaveBeenCalled();
    expect(setCsvFileMock).toHaveBeenCalledWith(file);
  });

  test('если нет отчета, то отображается заглушка хайлайтов', () => {
    initStore({ currentReport: null });
    render(<HomePage />);

    const highlightsEmpty = screen.getByTestId('empty-highlights');

    expect(highlightsEmpty).toBeInTheDocument();
  });

  test('если нет отчета, то отображается заглушка хайлайтов', () => {
    initStore({
      currentReport: {
        total_spend_galactic: 100,
        rows_affected: 100,
        less_spent_at: 100,
        big_spent_at: 100,
        less_spent_value: 100,
        big_spent_value: 100,
        average_spend_galactic: 100,
        big_spent_civ: 'humans',
        less_spent_civ: 'blobs',
      },
    });
    render(<HomePage />);

    const highlightsEmpty = screen.getByTestId('highlights');

    expect(highlightsEmpty).toBeInTheDocument();
  });

  test('при очистке формы удаляется файл и отображается заглушка хайлайтов', async () => {
    initStore({
      currentReport: {
        total_spend_galactic: 100,
        rows_affected: 100,
        less_spent_at: 100,
        big_spent_at: 100,
        less_spent_value: 100,
        big_spent_value: 100,
        average_spend_galactic: 100,
        big_spent_civ: 'humans',
        less_spent_civ: 'blobs',
      },
      csvFile: new File([], 'test1.csv'),
    });

    render(<HomePage />);

    const buttonClear = screen.getByTestId('button-clear');

    await events.click(buttonClear);

    expect(resetReportMock).toHaveBeenCalled();
    expect(setCsvFileMock).toHaveBeenCalledWith(null);
  });

  test('форма загрузки при инициализации находится в начальном состоянии', () => {
    const { container } = render(<HomePage />);
    const buttonWrapper = container.querySelector('[data-variant=initial]');

    expect(buttonWrapper).toBeInTheDocument();
  });

  test('форма загрузки при ошибке находится в состоянии ошибки', () => {
    initStore({
      isReportError: true,
    });
    const { container } = render(<HomePage />);
    const buttonWrapper = container.querySelector('[data-variant=error]');

    expect(buttonWrapper).toBeInTheDocument();
  });

  test('форма загрузки при загрузке находится в состоянии загрузки', () => {
    initStore({
      isReportLoading: true,
    });
    const { container } = render(<HomePage />);
    const buttonWrapper = container.querySelector('[data-variant=loading]');

    expect(buttonWrapper).toBeInTheDocument();
  });

  test('форма загрузки при успехе находится в состоянии успеха', () => {
    initStore({
      isReportSuccess: true,
    });
    const { container } = render(<HomePage />);
    const buttonWrapper = container.querySelector('[data-variant=success]');

    expect(buttonWrapper).toBeInTheDocument();
  });

  test('форма загрузки при загруженном csv файле находится в состоянии загруженного файла', () => {
    initStore({
      csvFile: new File([], 'test1.csv'),
    });
    const { container } = render(<HomePage />);
    const buttonWrapper = container.querySelector('[data-variant=loaded]');

    expect(buttonWrapper).toBeInTheDocument();
  });
});
