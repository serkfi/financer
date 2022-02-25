/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Container } from '../../components/container/container';
import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { useEditIncome } from '../../hooks/income/useEditIncome';
import { useIncomeById } from '../../hooks/income/useIncomeById';
import {
  addTransactionCategoryMapping,
  getTransactionCategoryMappingByTransactionId,
} from '../../services/TransactionCategoryMappingService';

import { IncomeForm } from './IncomeForm';

export const EditIncome = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();

  const [income] = useIncomeById(id);
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);
  const editIncome = useEditIncome();

  useEffect(() => {
    const fetchTransactionCategoryMapping = async () => {
      setTransactionCategoryMapping(
        await getTransactionCategoryMappingByTransactionId(id)
      );
    };

    fetchTransactionCategoryMapping();
  }, [id]);

  const handleSubmit = async (
    targetIncomeData: IIncome,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const targetIncomeJson = await editIncome(targetIncomeData, id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newTransactionCategoryMappingJson =
        await addTransactionCategoryMapping(
          newTransactionCategoryMappingsData.map(
            (newTransactionCategoryMappingData) => ({
              ...newTransactionCategoryMappingData,
              transaction_id: targetIncomeJson.payload._id,
            })
          )
        );

      if (targetIncomeJson.status === 201) {
        history.push('/statistics/incomes');
      } else if (targetIncomeJson.status === 400) {
        setErrors(targetIncomeJson?.errors || ['Unknown error.']);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return !income || typeof transactionCategoryMapping === 'undefined' ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`Edit ${income.description} | Incomes`} />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit income"
        submitLabel="Update"
        amount={income.amount}
        description={income.description}
        date={new Date(income.date)}
        toAccount={income.toAccount}
        transactionCategoryMapping={transactionCategoryMapping}
      />
    </>
  );
};
