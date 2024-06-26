import { Response } from '@playwright/test';

import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Transaction category analytics', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

  const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

  test('Should return correct amounts when category has incomes and expenses', async ({
    page,
  }) => {
    // 623b58ada3deba9879422fbf = Category for all types
    const response = (await page.goto(
      '/api/transactions/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=623b58ada3deba9879422fbf',
    )) as Response;
    expect(response.status()).toBe(200);
    const [body] = await response.json();

    expect(body.totalCount).toBe(4);
    expect(body.incomesCount).toBe(2);
    expect(body.expensesCount).toBe(2);
    expect(body.transferCount).toBe(0);

    expect(roundToTwoDecimals(body.totalAmount)).toBe(872.95);
    expect(roundToTwoDecimals(body.incomeAmount)).toBe(3367.11);
    expect(roundToTwoDecimals(body.expenseAmount)).toBe(2494.16);
    expect(roundToTwoDecimals(body.transferAmount)).toBe(0);

    const response2 = (await page.goto(
      '/api/incomes/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=623b58ada3deba9879422fbf',
    )) as Response;

    expect(response2.status()).toBe(200);
    const [body2] = await response2.json();

    expect(body2.totalCount).toBe(2);
    expect(body2.incomesCount).toBe(2);
    expect(body2.expensesCount).toBe(2);
    expect(body2.transferCount).toBe(0);

    expect(roundToTwoDecimals(body2.totalAmount)).toBe(3367.11);
    expect(roundToTwoDecimals(body2.incomeAmount)).toBe(3367.11);
    expect(roundToTwoDecimals(body2.expenseAmount)).toBe(2494.16);
    expect(roundToTwoDecimals(body2.transferAmount)).toBe(0);

    const response3 = (await page.goto(
      '/api/expenses/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=623b58ada3deba9879422fbf',
    )) as Response;
    expect(response3.status()).toBe(200);
    const [body3] = await response3.json();

    expect(body3.totalCount).toBe(2);
    expect(body3.incomesCount).toBe(2);
    expect(body3.expensesCount).toBe(2);
    expect(body3.transferCount).toBe(0);

    expect(roundToTwoDecimals(body3.totalAmount)).toBe(2494.16);
    expect(roundToTwoDecimals(body3.incomeAmount)).toBe(3367.11);
    expect(roundToTwoDecimals(body3.expenseAmount)).toBe(2494.16);
    expect(roundToTwoDecimals(body3.transferAmount)).toBe(0);

    const response4 = (await page.goto(
      '/api/transfers/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=623b58ada3deba9879422fbf',
    )) as Response;
    expect(response4.status()).toBe(200);
    const [body4] = await response4.json();

    expect(body4.totalCount).toBe(0);
    expect(body4.incomesCount).toBe(2);
    expect(body4.expensesCount).toBe(2);
    expect(body4.transferCount).toBe(0);

    expect(roundToTwoDecimals(body4.totalAmount)).toBe(0);
    expect(roundToTwoDecimals(body4.incomeAmount)).toBe(3367.11);
    expect(roundToTwoDecimals(body4.expenseAmount)).toBe(2494.16);
    expect(roundToTwoDecimals(body4.transferAmount)).toBe(0);
  });

  test('Should return correct amounts', async ({ page }) => {
    // 623b58ada3deba9879422fbf = Category for all types
    const response = (await page.goto(
      '/api/transaction-categories/623b58ada3deba9879422fbf/summary?year=2022&month=01&page=1&limit=500',
    )) as Response;
    expect(response.status()).toBe(200);
    const [body] = await response.json();

    expect(body.total.count).toBe(4);
    expect(roundToTwoDecimals(body.total.amount)).toBe(1135.55);
    expect(roundToTwoDecimals(body.total.transactionAmount)).toBe(872.95);

    expect(body.income.count).toBe(2);
    expect(roundToTwoDecimals(body.income.amount)).toBe(2271.53);
    expect(roundToTwoDecimals(body.income.transactionAmount)).toBe(3367.11);

    expect(body.expense.count).toBe(2);
    expect(roundToTwoDecimals(body.expense.amount)).toBe(1135.98);
    expect(roundToTwoDecimals(body.expense.transactionAmount)).toBe(2494.16);

    expect(body.transfer.count).toBe(0);
    expect(roundToTwoDecimals(body.transfer.amount)).toBe(0);
    expect(roundToTwoDecimals(body.transfer.transactionAmount)).toBe(0);
  });
});
