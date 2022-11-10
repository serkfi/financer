import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { Divider } from '../../components/divider/divider';
import { IconName } from '../../components/icon/icon';
import { InfoCard } from '../../components/info-card/info-card';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useDeleteIncome } from '../../hooks/income/useDeleteIncome';
import { useIncomeById } from '../../hooks/income/useIncomeById';
import { useAllTransactionCategoriesWithCategoryTree } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface IIncomeDeleteModalProps {
  handleDelete(): void;
}

const IncomeDeleteModal = ({ handleDelete }: IIncomeDeleteModalProps) => (
  <ModalConfirm
    label="Delete income"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete income"
    accentColor="red"
    testId="income-delete-modal"
  >
    Are you sure you want to delete your income? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const Income = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'missing-id' } = useParams<{ id: string }>();
  const income = useIncomeById(id);
  const account = useAccountById(income?.toAccount);
  const transactionCategories = useAllTransactionCategoriesWithCategoryTree();
  const deleteIncome = useDeleteIncome();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete income: no id');
      return;
    }
    await deleteIncome(id);
    navigate('/statistics/incomes');
  };

  return (
    <>
      <UpdatePageInfo
        title={`${income.description}`}
        backLink="/statistics/incomes"
      />
      <section className="grid gap-2 lg:gap-4">
        <section className="grid grid-cols-2 gap-2 lg:grid-cols-3 md:gap-4">
          <InfoCard iconName={IconName.cash} label="Amount">
            {formatCurrency(income.amount)}
          </InfoCard>
          <InfoCard iconName={IconName.calendar} label="Date">
            {formatDate(new Date(income.date))}
          </InfoCard>
          <InfoCard
            iconName={IconName.informationCircle}
            label="Type"
            className="max-lg:col-span-full"
            isLarge
          >
            Income
          </InfoCard>
          <InfoCard
            iconName={IconName.download}
            label="To account"
            className="col-span-full"
            isLarge
          >
            {account?.name ?? '-'}
          </InfoCard>
        </section>
        {income.categories.length > 0 && (
          <>
            <Divider>Categories</Divider>
            <ul>
              {income.categories?.map(({ amount, category_id }) => (
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
            link={`/statistics/incomes/${id}/edit`}
            testId="edit-income-button"
          >
            Edit
          </Button>
          <IncomeDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </section>
    </>
  );
};
