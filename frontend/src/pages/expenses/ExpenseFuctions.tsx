import React from "react";

import { Link } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";

export interface IExpenseOutput
  extends Omit<IExpense, "date" | "amount" | "_id"> {
  _id: string;
  actions: JSX.Element;
  date: Date;
  amount: string;
}

export interface IExpensesPerMonth {
  month: number;
  total: number;
  year: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
}

export const groupExpensesByMonth = (
  dateStack: IExpensesPerMonth[],
  { _id, amount, date: dateRaw, ...expenseRest }: IExpense
): IExpensesPerMonth[] => {
  const date = new Date(dateRaw);
  const month = date.getMonth();
  const year = date.getFullYear();

  const expense: IExpenseOutput = {
    ...expenseRest,
    _id,
    amount: formatCurrency(amount),
    date,
    actions: (
      <Link
        to={`/expenses/${_id}`}
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-sm"
      >
        View
      </Link>
    ),
  };

  const isMonthInDateStack = dateStack.some(
    ({ month: stackMonth, year: stackYear }) =>
      month === stackMonth && year === stackYear
  );

  if (isMonthInDateStack) {
    const isTargetMonthAndYear = (targetYear: number, targetMonth: number) =>
      targetYear === year && targetMonth === month;

    return dateStack.map(
      ({
        month: stackMonth,
        year: stackYear,
        total: stackTotal,
        rows: stackRows,
      }) => ({
        month: stackMonth,
        year: stackYear,
        total: isTargetMonthAndYear(stackYear, stackMonth)
          ? stackTotal + amount
          : stackTotal,
        rows: isTargetMonthAndYear(stackYear, stackMonth)
          ? [...stackRows, expense]
          : stackRows,
      })
    );
  }

  return dateStack.concat({
    year,
    month,
    total: amount,
    rows: [expense],
  });
};

export const sortExpenseStacksByMonth = (
  a: IExpensesPerMonth,
  b: IExpensesPerMonth
): 0 | 1 | -1 => {
  if (a.year > b.year) {
    return -1;
  }

  if (b.year > a.year) {
    return 1;
  }

  if (a.month > b.month) {
    return -1;
  }

  if (b.month > a.month) {
    return 1;
  }

  return 0;
};

export const sortExpensesByDate = (
  stack: IExpensesPerMonth
): IExpensesPerMonth => {
  stack.rows.sort((a, b) => (a.date > b.date ? -1 : 1));
  return stack;
};