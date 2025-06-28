import { test, expect } from '@playwright/test';

const reportsData = [
  {
    id: '1',
    report: {
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
    fileName: 'test1.csv',
    isFailed: false,
    date: '2025-06-28',
  },
  {
    id: '2',
    report: {
      total_spend_galactic: null,
      rows_affected: null,
      less_spent_at: null,
      big_spent_at: null,
      less_spent_value: null,
      big_spent_value: null,
      average_spend_galactic: null,
      big_spent_civ: '',
      less_spent_civ: '',
    },
    fileName: 'test2_failed.csv',
    isFailed: true,
    date: '2025-06-28',
  },
];

test.describe('Тестирование страницы истории', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/history');

    await page.evaluate(() => localStorage.clear());

    await page.evaluate((data) => {
      localStorage.setItem('reports', JSON.stringify(data));
    }, reportsData);

    await page.reload();
  });

  test('при открытии страницы загружается история', async ({ page }) => {
    await expect(page.getByTestId('reports-history')).toBeVisible();
  });

  test('при очистке истории она не отображается', async ({ page }) => {
    const buttonClear = page.getByTestId('button-clear');

    await buttonClear.click();

    await expect(page.getByTestId('reports-history')).not.toBeVisible();
  });

  test('при клике на успешный отчет он открывается в модалке', async ({ page }) => {
    await page.getByTestId('saved-report-1').click();

    await expect(page.getByTestId('modal')).toBeVisible();
  });

  test('при клике на невалидный отчет он не открывается в модалке', async ({ page }) => {
    await page.getByTestId('saved-report-2').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('при удалении отчета он удаляется из истории', async ({ page }) => {
    await expect(page.getByTestId('saved-report-1')).toBeVisible();

    await page.getByTestId('button-delete-1').click();

    await expect(page.getByTestId('saved-report-1')).not.toBeVisible();

    await page.reload();

    await expect(page.getByTestId('saved-report-1')).not.toBeVisible();
  });
});
