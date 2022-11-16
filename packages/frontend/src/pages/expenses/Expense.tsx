import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/elements/button/button';
import { ButtonGroup } from '../../components/elements/button/button.group';
import { DialogConfirm } from '../../components/elements/dialog/confirm/dialog.confirm';
import { Dialog } from '../../components/elements/dialog/dialog';
import { Divider } from '../../components/elements/divider/divider';
import { IconName } from '../../components/elements/icon/icon';
import { InfoCard } from '../../components/elements/info-card/info-card';
import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useDeleteExpense } from '../../hooks/expense/useDeleteExpense';
import { useExpenseById } from '../../hooks/expense/useExpenseById';
import { useAllTransactionCategoriesWithCategoryTree } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface IExpenseDeleteModalProps {
  handleDelete(): void;
}

const ExpenseDeleteModal = ({ handleDelete }: IExpenseDeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        testId="expense-delete-modal_open-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Delete
      </Button>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogConfirm
          label="Delete expense"
          onConfirm={handleDelete}
          onCancel={() => setIsOpen(!isOpen)}
          submitButtonLabel="Delete"
          iconName={IconName.exclamation}
          testId="expense-delete-modal"
        >
          Are you sure you want to delete your expense? All of your data will be
          permanently removed. This action cannot be undone.
        </DialogConfirm>
      </Dialog>
    </>
  );
};

export const Expense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const expense = useExpenseById(id);
  const account = useAccountById(expense?.fromAccount);
  const transactionCategories = useAllTransactionCategoriesWithCategoryTree();
  const deleteExpense = useDeleteExpense();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete expense: no id');
      return;
    }
    await deleteExpense(id);
    navigate('/statistics/expenses');
  };

  return (
    <>
      <UpdatePageInfo
        title={`${expense.description}`}
        backLink="/statistics/expenses"
      />
      <section className="grid gap-2 lg:gap-4">
        <section className="grid grid-cols-2 gap-2 lg:grid-cols-3 md:gap-4">
          <InfoCard iconName={IconName.cash} label="Amount">
            {formatCurrency(expense.amount)}
          </InfoCard>
          <InfoCard iconName={IconName.calendar} label="Date">
            {formatDate(new Date(expense.date))}
          </InfoCard>
          <InfoCard
            iconName={IconName.informationCircle}
            label="Type"
            className="max-lg:col-span-full"
            isLarge
          >
            Expense
          </InfoCard>
          <InfoCard
            iconName={IconName.upload}
            label="From account"
            className="col-span-full"
            isLarge
          >
            {account?.name ?? '-'}
          </InfoCard>
        </section>
        {expense.categories.length > 0 && (
          <>
            <Divider>Categories</Divider>
            <ul>
              {expense.categories?.map(({ amount, category_id }) => (
                <li className="grid grid-cols-2 gap-2">
                  <InfoCard
                    iconName={IconName.tag}
                    label="Category"
                    testId="category_label"
                  >
                    {getCategoryNameById(category_id)}
                  </InfoCard>
                  <InfoCard
                    iconName={IconName.cash}
                    label="Amount"
                    testId="category_amount"
                  >
                    {formatCurrency(amount)}
                  </InfoCard>
                </li>
              ))}
            </ul>
          </>
        )}
        <ButtonGroup className="mt-4">
          <Button
            link={`/statistics/expenses/${id}/edit`}
            testId="edit-expense-button"
          >
            Edit
          </Button>
          <ExpenseDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </section>
    </>
  );
};
