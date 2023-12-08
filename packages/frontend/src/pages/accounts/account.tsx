import { AccountBalanceHistoryChart } from './account.balance-history-chart';

import { AccountDto } from '$api/generated/financerApi';
import { accountTypeIconMapping } from '$blocks/accounts-list/accounts-list';
import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { LatestAccountTransactions } from '$blocks/latest-account-transactions/latest-account-transactions';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { AccountUpdateMarketValueContainer } from '$container/accounts/account.update-market-value.container';
import { ButtonInternal } from '$elements/button/button.internal';
import { Icon, IconName } from '$elements/icon/icon';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface AccountProps {
  isLoading: boolean;
  account: AccountDto;
  filterOptions: typeof initialMonthFilterOptions;
  firstAvailableTransaction: Date;
  onMonthOptionChange: (direction: 'next' | 'previous') => void;
}

export const Account = ({
  isLoading,
  account,
  filterOptions,
  firstAvailableTransaction,
  onMonthOptionChange,
}: AccountProps): JSX.Element | null => {
  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];

  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title={`Account Details`}
        backLink="/accounts"
        headerAction={
          <ButtonInternal
            link={`/accounts/${account._id}/edit`}
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
          >
            <span className="sr-only">Edit</span>
            <Icon type={IconName.pencilSquare} />
          </ButtonInternal>
        }
      />
      <section>
        <BalanceDisplay
          amount={account.balance}
          iconName={accountTypeIconMapping[account.type]}
          className="mb-8"
        >
          {account.name}
        </BalanceDisplay>
        <LoaderSuspense>
          <AccountBalanceHistoryChart accountId={account._id} />
        </LoaderSuspense>
        <div className="grid gap-2 mt-6">
          {account.type === 'investment' && (
            <AccountUpdateMarketValueContainer account={account} />
          )}
        </div>
        <Pager
          className="mt-8 mb-2"
          pagerOptions={{
            nextPage: {
              isAvailable: !(
                filterOptions.month === initialMonthFilterOptions.month &&
                filterOptions.year === initialMonthFilterOptions.year
              ),
              load: () => onMonthOptionChange('next'),
            },
            previousPage: {
              isAvailable: !(
                filterOptions.month ===
                  firstAvailableTransaction.getMonth() + 1 &&
                filterOptions.year === firstAvailableTransaction.getFullYear()
              ),
              load: () => onMonthOptionChange('previous'),
            },
          }}
        >{`${pageVisibleMonth} ${pageVisibleYear}`}</Pager>
        <LoaderSuspense>
          <LatestAccountTransactions
            accountId={account._id}
            filterOptions={filterOptions}
          />
        </LoaderSuspense>
      </section>
    </>
  );
};
