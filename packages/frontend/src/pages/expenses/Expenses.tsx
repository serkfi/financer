import { SortOrder } from '@local/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LatestTransactions } from '../../components/blocks/latest-transactions/latest-transactions';
import { initialMonthFilterOptions } from '../../components/blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '../../components/blocks/pager/pager';
import { Heading } from '../../components/elements/heading/heading';
import { IconName } from '../../components/elements/icon/icon';
import { LinkList } from '../../components/elements/link-list/link-list';
import { LinkListLink } from '../../components/elements/link-list/link-list.link';
import { LoaderSuspense } from '../../components/elements/loader/loader-suspense';
import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';
import { monthNames } from '../../constants/months';
import { useAllExpensesPaged } from '../../hooks/expense/useAllExpenses';
import { useAllTransactionsPaged } from '../../hooks/transaction/useAllTransactions';

export const Expenses = (): JSX.Element => {
  const {
    year: initialYear,
    month: initialMonth,
    page: initialPage = '1',
  } = useParams<{ year?: string; month?: string; page?: string }>();
  const [selectedPage, setSelectedPage] = useState(parseInt(initialPage));

  const [monthFilterOptions, setMonthFilterOptions] = useState(
    !initialYear || !initialMonth
      ? initialMonthFilterOptions
      : {
          year: parseInt(initialYear),
          month: parseInt(initialMonth),
          page: selectedPage,
        }
  );
  const {
    data: {
      data: [transaction],
    },
  } = useAllTransactionsPaged(1, {
    limit: 1,
    sortOrder: SortOrder.ASC,
  });

  const [initialPageToLoad, setInitialPage] = useState(selectedPage);

  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      pathname: `/statistics/expenses/${
        monthFilterOptions.year
      }-${monthFilterOptions.month
        .toString()
        .padStart(2, '0')}/${selectedPage}`,
    });

    setInitialPage(1);
  }, [
    monthFilterOptions.year,
    monthFilterOptions.month,
    navigate,
    selectedPage,
  ]);

  const firstTransactionEverDate = new Date(transaction?.date || new Date());

  const pageVisibleYear = monthFilterOptions.year;
  const pageVisibleMonth = monthNames[monthFilterOptions.month - 1];

  const handleMonthOptionChange = (direction: 'next' | 'previous') => {
    const { month, year } = monthFilterOptions;
    const monthWithTwoDigits = month.toString().padStart(2, '0');
    const selectedMonth = new Date(`${year}-${monthWithTwoDigits}-01`);

    selectedMonth.setMonth(
      selectedMonth.getMonth() + (direction === 'next' ? 1 : -1)
    );

    setMonthFilterOptions({
      month: selectedMonth.getMonth() + 1,
      year: selectedMonth.getFullYear(),
    });
  };

  return (
    <>
      <UpdatePageInfo title="Expenses" />
      <section className="mb-8">
        <LinkList>
          <LinkListLink
            testId="add-expense"
            link="/statistics/expenses/add"
            icon={IconName.download}
          >
            Add expense
          </LinkListLink>
        </LinkList>
      </section>
      <section className="flex items-center justify-between mb-4">
        <Heading>{`${pageVisibleMonth}, ${pageVisibleYear}`}</Heading>
        <Pager
          pagerOptions={{
            nextPage: {
              isAvailable: !(
                monthFilterOptions.month === initialMonthFilterOptions.month &&
                monthFilterOptions.year === initialMonthFilterOptions.year
              ),
              load: () => handleMonthOptionChange('next'),
            },
            previousPage: {
              isAvailable: !(
                monthFilterOptions.month ===
                  firstTransactionEverDate.getMonth() + 1 &&
                monthFilterOptions.year ===
                  firstTransactionEverDate.getFullYear()
              ),
              load: () => handleMonthOptionChange('previous'),
            },
          }}
        />
      </section>
      <LoaderSuspense>
        <LatestTransactions
          filterOptions={monthFilterOptions}
          className="mt-4"
          useDataHook={useAllExpensesPaged}
          onPageChange={setSelectedPage}
          initialPage={initialPageToLoad}
        />
      </LoaderSuspense>
    </>
  );
};
