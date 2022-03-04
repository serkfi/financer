import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SEO } from '../../components/seo/seo';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';
import { useAddTransfer } from '../../hooks/transfer/useAddTransfer';

import { TransferForm } from './TransferForm';

export const AddTransfer = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransactionCategoryMapping = useAddTransactionCategoryMapping();
  const addTransaction = useAddTransfer();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (
    newTransfer: ITransaction,
    transactionCategoryMappings: ITransactionCategoryMapping[]
  ) => {
    try {
      const newTransactionJson = await addTransaction(newTransfer);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newTransactionCategoryMappingJson =
        await addTransactionCategoryMapping(
          transactionCategoryMappings.map(
            (newTransactionCategoryMappingData) => ({
              ...newTransactionCategoryMappingData,
              transaction_id: newTransactionJson.payload._id,
            })
          )
        );

      if (newTransactionJson.status === 201) {
        navigate('/statistics/transfers');
      } else if (newTransactionJson.status === 400) {
        setErrors(newTransactionJson?.errors || ['Unknown error.']);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SEO title="Add transfer" />
      <TransferForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add transfer"
        submitLabel="Submit"
      />
    </>
  );
};
