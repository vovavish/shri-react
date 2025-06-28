import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import events from '@testing-library/user-event';
import { type ReportSlice } from '../../store/ReportStore';
import { useStore } from '../../store';
import '@testing-library/jest-dom';
import { HistoryPage } from '../../pages/HistoryPage';
import { MemoryRouter, useNavigate } from 'react-router-dom';

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

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Тестирование страницы генерации отчета (GeneratorPage)', () => {
  const loadSavedReportsMock = vi.fn();
  const clearSavedReportsMock = vi.fn();
  const removeReportByIdMock = vi.fn();

  const initStore = (overrides = {}) => {
    useStore.setState({
      savedReports: [],
      loadSavedReports: loadSavedReportsMock,
      clearSavedReports: clearSavedReportsMock,
      removeReportById: removeReportByIdMock,
      ...overrides,
    });
  };
  beforeEach(() => {
    loadSavedReportsMock.mockClear();
    clearSavedReportsMock.mockClear();
    removeReportByIdMock.mockClear();
    vi.mocked(useNavigate).mockClear();
    initStore();
  });

  test('при рендере страницы загружается история', async () => {
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    expect(loadSavedReportsMock).toHaveBeenCalled();
  });

  test('при рендере страницы с пустой историей отображается только кнопка сгенерировать больше', () => {
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    const buttonGenerateMore = screen.getByTestId('button-generate-more');
    const buttonClear = screen.queryByTestId('button-clear');
    const reportHistory = screen.queryByTestId('reports-history');

    expect(buttonGenerateMore).toBeInTheDocument();
    expect(buttonClear).not.toBeInTheDocument();
    expect(reportHistory).not.toBeInTheDocument();
  });

  test('кнопка сгенерировать больше перенаправляет на страницу генерации', async () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    render(
      <MemoryRouter initialEntries={['/history']}>
        <HistoryPage />
      </MemoryRouter>,
    );
    const buttonGenerateMore = screen.getByTestId('button-generate-more');

    await events.click(buttonGenerateMore);

    expect(navigate).toHaveBeenCalledWith('/generator');
  });

  test('если есть история, отображается кнопка очистки истории и кпнока сгенерировать больше', () => {
    initStore({
      savedReports: [{ id: 1, isFailed: false, report: {} }],
    });
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    const buttonGenerateMore = screen.getByTestId('button-generate-more');
    const buttonClear = screen.getByTestId('button-clear');

    expect(buttonGenerateMore).toBeInTheDocument();
    expect(buttonClear).toBeInTheDocument();
  });

  test('если есть история, она отображается', () => {
    initStore({
      savedReports: [{ id: 1, isFailed: false, report: {} }],
    });
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    const reportHistory = screen.getByTestId('reports-history');

    expect(reportHistory).toBeInTheDocument();
  });

  test('при очистке истории вызывается функция очистки', async () => {
    initStore({
      savedReports: [{ id: 1, isFailed: false, report: {} }],
    });
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    const buttonClear = screen.getByTestId('button-clear');

    await events.click(buttonClear);

    expect(clearSavedReportsMock).toHaveBeenCalled();
  });

  test('при удалении отчета вызывается функция удаления', async () => {
    initStore({
      savedReports: [{ id: 1, isFailed: false, report: {} }],
    });
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    const buttonDelete = screen.getByTestId('button-delete-1');

    await events.click(buttonDelete);

    expect(removeReportByIdMock).toHaveBeenCalled();
  });
});
