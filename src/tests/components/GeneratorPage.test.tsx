import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import events from '@testing-library/user-event';
import { GeneratorPage } from '../../pages/GeneratorPage';
import { type ReportSlice } from '../../store/ReportStore';
import { useStore } from '../../store';

import '@testing-library/jest-dom';

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
  const getReportMock = vi.fn();
  const resetReportGeneratingMock = vi.fn();

  const initStore = (overrides = {}) => {
    useStore.setState({
      isReportGenerating: false,
      isReportGeneratingError: false,
      isReportGeneratingSuccess: false,
      getReport: getReportMock,
      resetReportGenerating: resetReportGeneratingMock,
      ...overrides,
    });
  };
  beforeEach(() => {
    getReportMock.mockClear();
    resetReportGeneratingMock.mockClear();
    initStore();
  });

  test('При рендере страницы отображается заголовок и кнопка', () => {
    render(<GeneratorPage />);

    const title = screen.getByTestId('title');
    const button = screen.getByTestId('button');

    expect(title).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('отчет генерируется, если состояние изначальное', async () => {
    render(<GeneratorPage />);
    const button = screen.getByTestId('button');

    await events.click(button);

    expect(useStore.getState().getReport).toHaveBeenCalled();
  });

  test('отчет не генерируется, если состояние загрузки', async () => {
    initStore({
      isReportGenerating: true,
    });
    render(<GeneratorPage />);
    const button = screen.getByTestId('button');

    await events.click(button);

    expect(useStore.getState().getReport).not.toHaveBeenCalled();
  });

  test('отчет не генерируется, если состояние ошибки', async () => {
    initStore({
      isReportGeneratingError: true,
    });
    render(<GeneratorPage />);
    const button = screen.getByTestId('button');

    await events.click(button);

    expect(useStore.getState().getReport).not.toHaveBeenCalled();
  });

  test('кнопка в начальном состоянии имеет начальное состояние', () => {
    const { container } = render(<GeneratorPage />);
    const buttonWrapper = container.querySelector('[data-variant=initial]');

    expect(buttonWrapper).toBeInTheDocument();
  });

  test('кнопка в состоянии загрузки файла имеет состояние загрузки', () => {
    initStore({
      isReportGenerating: true,
    });
    const { container } = render(<GeneratorPage />);
    const buttonWrapper = container.querySelector('[data-variant=loading]');

    expect(buttonWrapper).toBeInTheDocument();
  });

  test('кнопка в состоянии ошибки загрузки файла имеет состояние ошибки', () => {
    initStore({
      isReportGeneratingError: true,
    });
    const { container } = render(<GeneratorPage />);
    const buttonWrapper = container.querySelector('[data-variant=error]');

    expect(buttonWrapper).toBeInTheDocument();
  });

  test('кнопка в состоянии успеха загрузки файла имеет состояние успеха', () => {
    initStore({
      isReportGeneratingSuccess: true,
    });
    const { container } = render(<GeneratorPage />);
    const buttonWrapper = container.querySelector('[data-variant=success]');

    expect(buttonWrapper).toBeInTheDocument();
  });

  test('при сбросе состояния вызывается функция сброса состояния', async () => {
    initStore({
      isReportGeneratingSuccess: true,
    });
    render(<GeneratorPage />);

    const buttonClear = screen.getByTestId('button-clear');

    await events.click(buttonClear);

    expect(useStore.getState().resetReportGenerating).toHaveBeenCalled();
  });

  test('при сбросе состояния кнопка переходит в изначальное состояние', async () => {
    initStore({
      isReportGeneratingSuccess: true,
    });
    const { container } = render(<GeneratorPage />);

    const buttonClear = screen.getByTestId('button-clear');

    await events.click(buttonClear);

    const buttonWrapper = container.querySelector('[data-variant=initial]');

    expect(buttonWrapper).toBeInTheDocument();
  });
});
