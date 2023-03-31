import { useRouter } from 'next/router';
import { useState } from 'react';

import { ExpenseForm } from './ExpenseForm';

import {
  CreateExpenseDto,
  TransactionTypeEnum,
  useExpensesCreateMutation,
} from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { useUserDefaultExpenseAccount } from '$hooks/profile/user-preference/useUserDefaultExpenseAccount';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddExpense = (): JSX.Element => {
  const { push } = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [addExpense, { isLoading: isCreating }] = useExpensesCreateMutation();
  const { data: defaultExpenseAccount, isLoading: isLoadingDefaultAccount } =
    useUserDefaultExpenseAccount();

  const handleSubmit = async (newExpenseData: CreateExpenseDto) => {
    try {
      await addExpense({
        createExpenseDto: newExpenseData,
      }).unwrap();

      push('/statistics/expenses');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 404) {
        setErrors(parseErrorMessagesToArray(error?.data?.message));
        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const isLoading = isLoadingDefaultAccount;

  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add expense"
        headerAction={
          <TransactionTemplateSwitcher
            templateType={TransactionTypeEnum.Expense}
          />
        }
      />
      {isLoading ? (
        <Loader />
      ) : (
        <ExpenseForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Submit"
          initialValues={{ fromAccount: defaultExpenseAccount }}
        />
      )}
    </>
  );
};
