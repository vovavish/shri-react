import { test, expect } from '@playwright/test';
import path from 'path';

test('при нажатии кнопки начинается процесс агрегации и появляются плавно накапливающиеся хайлайты', async ({
  page,
}) => {
  await page.goto('http://localhost:5173');

  const filePath = path.resolve(__dirname, './valid_report.csv');
  const inputFile = page.getByTestId('input-file');
  const buttonSend = page.getByTestId('button-send');

  await inputFile.setInputFiles(filePath);
  await expect(buttonSend).toBeEnabled();

  await buttonSend.click();

  const rowsAffectedStart = Number.parseInt(
    await page.getByTestId('highlight-rows_affected').innerText(),
  );

  await page.waitForSelector('[data-variant="success"]');

  const rowsAffectedEnd = Number.parseInt(
    await page.getByTestId('highlight-rows_affected').innerText(),
  );

  expect(rowsAffectedEnd).toBeGreaterThan(rowsAffectedStart);
});

test('если бэкенд недоступен, показывается ошибка и хайлайтов нет', async ({ page }) => {
  await page.route('**/aggregate?**', async (route) => {
    await route.abort();
  });

  await page.goto('http://localhost:5173');

  const filePath = path.resolve(__dirname, './valid_report.csv');
  const inputFile = page.getByTestId('input-file');
  const buttonSend = page.getByTestId('button-send');

  await inputFile.setInputFiles(filePath);
  await expect(buttonSend).toBeEnabled();

  await buttonSend.click();

  const emptyHighlights = page.getByTestId('empty-highlights');
  await expect(emptyHighlights).toBeVisible();
});

test('если бекенд возвращает невалидные данные показывается ошибка', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const filePath = path.resolve(__dirname, './invalid_report.csv');
  const inputFile = page.getByTestId('input-file');
  const buttonSend = page.getByTestId('button-send');

  await inputFile.setInputFiles(filePath);
  await expect(buttonSend).toBeEnabled();

  await buttonSend.click();

  await page.waitForSelector('[data-variant="error"]');
  await expect(page.getByTestId('empty-highlights')).toBeVisible();
});
