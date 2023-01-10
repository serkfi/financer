import { useTransactionsByAccountIdPaged } from '../../../hooks/transaction/useTransactionsByAccountId';
import { useTransactionCategoryName } from '../../../hooks/transactionCategories/useTransactionCategoryName';
import { TransactionFilterOptions } from '../../../services/TransactionService';
import { TransactionStackedList } from '../../elements/transaction-stacked-list/transaction-stacked-list';
import { convertTransactionToTransactionStackedListRow } from '../latest-transactions/latest-transactions';

type LatestAccountTransactionsProps = {
  accountId: string;
  isPagerHidden?: boolean;
  filterOptions?: TransactionFilterOptions;
  className?: string;
};

export const LatestAccountTransactions = ({
  accountId,
  isPagerHidden,
  filterOptions = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  },
  className,
}: LatestAccountTransactionsProps): JSX.Element => {
  const getCategoryName = useTransactionCategoryName();
  const { data, pagerOptions } = useTransactionsByAccountIdPaged(
    accountId,
    1,
    filterOptions
  );

  return (
    <TransactionStackedList
      rows={data.data.map((transaction) =>
        convertTransactionToTransactionStackedListRow(
          transaction as any,
          getCategoryName
        )
      )}
      pagerOptions={pagerOptions}
      className={className}
      isPagerHidden={isPagerHidden}
    />
  );
};
