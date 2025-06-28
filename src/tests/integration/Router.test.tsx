import { render, screen } from '@testing-library/react';
import events from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { App } from '../../components/App';

import '@testing-library/jest-dom';

describe('Тестирование навигации', () => {
  test('при открытии домашней страницы должна открываться домашняя страница', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const homePage = screen.getByTestId('home-page');

    expect(homePage).toBeInTheDocument();
  });

  test('при открытии страницы генерации должна открываться страница генерации', () => {
    render(
      <MemoryRouter initialEntries={['/generator']}>
        <App />
      </MemoryRouter>,
    );

    const homePage = screen.getByTestId('generator-page');

    expect(homePage).toBeInTheDocument();
  });

  test('при открытии страницы генерации должна открываться страница генерации', () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <App />
      </MemoryRouter>,
    );

    const homePage = screen.getByTestId('history-page');

    expect(homePage).toBeInTheDocument();
  });

  test('при нажатии на CSV Аналитик открывается домашняя страница', async () => {
    render(
      <MemoryRouter initialEntries={['/generator']}>
        <App />
      </MemoryRouter>,
    );

    const homeLink = screen.getByTestId('home-link');

    await events.click(homeLink);

    const homePage = screen.getByTestId('home-page');

    expect(homePage).toBeInTheDocument();
  });

  test('при нажатии на CSV Генератор открывается странциа генерации', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const generatorLink = screen.getByTestId('generator-link');

    await events.click(generatorLink);

    const generatorPage = screen.getByTestId('generator-page');

    expect(generatorPage).toBeInTheDocument();
  });

  test('при нажатии на История открывается странциа истории', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const historyLink = screen.getByTestId('history-link');

    await events.click(historyLink);

    const historyPage = screen.getByTestId('history-page');

    expect(historyPage).toBeInTheDocument();
  });
});
