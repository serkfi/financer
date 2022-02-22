import { useState, useEffect } from 'react';

import { getAllUserTransactionCategoryMappings } from '../pages/expenses/Expenses';
import {
  groupIncomesByMonth,
  IIncomesPerMonth,
  sortIncomesByDate,
  sortIncomeStacksByMonth,
} from '../pages/income/IncomeFuctions';
import { getAllIncomes } from '../pages/income/IncomeService';
import { getAllTransactionCategories } from '../pages/profile/TransactionCategories/TransactionCategoriesService';

export const useAllIncomes = (): IIncome[] | null => {
  const [incomes, setIncomes] = useState<IIncome[] | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      setIncomes(await getAllIncomes());
    };

    fetchIncomes();
  }, []);

  return incomes;
};

export const useCurrentMonthIncomesTotalAmount = (): number => {
  const incomes = useAllIncomes();
  const [totalAmount, setTotalAmount] = useState(NaN);

  useEffect(() => {
    if (incomes === null) return;

    const total = incomes.reduce((currentTotal, { amount, date }) => {
      const currentMonth = new Date().getMonth() + 1;
      const month = new Date(date).getMonth() + 1;
      const currentYear = new Date().getFullYear();

      if (
        currentMonth === month &&
        currentYear === new Date(date).getFullYear()
      ) {
        return currentTotal + amount;
      }

      return currentTotal;
    }, 0);

    setTotalAmount(total);
  }, [incomes]);

  return totalAmount;
};

export const useAllIncomesGroupByMonth = () => {
  const incomes = useAllIncomes();
  const [groupedIncomes, setGroupedIncomes] = useState<IIncomesPerMonth[]>([]);
  const [transactionCategoryMappings, setTransactionCategoryMappings] =
    useState<ITransactionCategoryMapping[]>([]);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategory[]
  >([]);

  useEffect(() => {
    const fetchAllTransactionCategories = async () => {
      setTransactionCategories(await getAllTransactionCategories());
    };
    const fetchAllUserTransactionCategoryMappings = async () => {
      setTransactionCategoryMappings(
        await getAllUserTransactionCategoryMappings()
      );
    };

    fetchAllTransactionCategories();
    fetchAllUserTransactionCategoryMappings();
  }, []);

  useEffect(() => {
    if (incomes === null) return;

    setGroupedIncomes(
      incomes
        .map(({ _id, ...rest }) => {
          const categoryMappings = transactionCategoryMappings
            ?.filter(({ transaction_id }) => transaction_id === _id)
            .map(
              ({ category_id }) =>
                transactionCategories.find(
                  ({ _id: categoryId }) => category_id === categoryId
                )?.name
            )
            .filter(
              (categoryName) => typeof categoryName !== 'undefined'
              // @todo: Fix this type.
            ) as string[];

          return { _id, ...rest, categoryMappings };
        })
        .reduce<IIncomesPerMonth[]>(groupIncomesByMonth, [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [incomes, transactionCategories, transactionCategoryMappings]);

  return groupedIncomes;
};
