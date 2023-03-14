import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ExpenseForm } from './ExpenseForm';

import {
  UpdateExpenseDto,
  useExpensesFindOneQuery,
  useExpensesUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const EditExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id not found' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const [editExpense, { isLoading: isSaving }] = useExpensesUpdateMutation();

  const expenseData = useExpensesFindOneQuery({ id });
  const { data: expense } = expenseData;

  const handleSubmit = async (newExpenseData: UpdateExpenseDto) => {
    if (!id) {
      console.error('Failed to edit expense: no id');
      return;
    }
    try {
      await editExpense({
        updateExpenseDto: newExpenseData,
        id,
      }).unwrap();

      navigate('/statistics/expenses');
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

  return (
    <>
      {isSaving && <LoaderFullScreen />}
      <DataHandler {...expenseData} />
      <UpdatePageInfo title={`Edit ${expense?.description}`} />
      {expense && (
        <ExpenseForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Update"
          initialValues={expense}
        />
      )}
    </>
  );
};
