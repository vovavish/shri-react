import { test, expect } from '@playwright/test';

test('при нажатии кнопки начинается процесс генерации, скачивается файл и при очистке состояние сбрасывается', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/generator');

  const button = page.getByTestId('button');
  const buttonWrapper = page.locator('[data-variant]');

  await button.click();

  await expect(buttonWrapper).toHaveAttribute('data-variant', 'loading');

  await page.waitForSelector('[data-variant="success"]', { timeout: 5000 });
  await expect(buttonWrapper).toHaveAttribute('data-variant', 'success');

  const buttonClear = page.getByTestId('button-clear');

  await buttonClear.click();

  await expect(buttonWrapper).toHaveAttribute('data-variant', 'initial');
});

test('если бэкенд недоступен, показывается ошибка и при очистке состояние сбрасывается', async ({
  page,
}) => {
  await page.route('**/report?**', async (route) => {
    await route.abort();
  });

  await page.goto('http://localhost:5173/generator');

  const button = page.getByTestId('button');
  const buttonWrapper = page.locator('[data-variant]');

  await button.click();

  await page.waitForSelector('[data-variant="error"]', { timeout: 5000 });
  await expect(buttonWrapper).toHaveAttribute('data-variant', 'error');

  await expect(page.locator('text=упс, не то...')).toBeVisible();

  const buttonClear = page.getByTestId('button-clear');

  await buttonClear.click();
  await expect(buttonWrapper).toHaveAttribute('data-variant', 'initial');
});
