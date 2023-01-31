import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TransferForm } from './TransferForm';

import {
  CreateTransferDto,
  TransactionTypeEnum,
  useTransfersCreateMutation,
} from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { useUserDefaultTransferSourceAccount } from '$hooks/profile/user-preference/useUserDefaultTransferSourceAccount';
import { useUserDefaultTransferTargetAccount } from '$hooks/profile/user-preference/useUserDefaultTransferTargetAccount';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddTransfer = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const [addTransaction, { isLoading: isCreating }] =
    useTransfersCreateMutation();
  const {
    data: defaultTransferSourceAccount,
    isLoading: isLoadingDefaultTransferSourceAccount,
  } = useUserDefaultTransferSourceAccount();
  const {
    data: defaultTransferTargetAccount,
    isLoading: isLoadingDefaultTransferTargetAccount,
  } = useUserDefaultTransferTargetAccount();

  const handleSubmit = async (newTransfer: CreateTransferDto) => {
    try {
      const newTransactionJson = await addTransaction({
        createTransferDto: newTransfer,
      });

      if ('message' in newTransactionJson) {
        setErrors(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parseErrorMessagesToArray((newTransactionJson as any).message)
        );
        return;
      }

      navigate('/statistics/transfers');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const isLoading =
    isLoadingDefaultTransferSourceAccount ||
    isLoadingDefaultTransferTargetAccount;

  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add transfer"
        headerAction={
          <TransactionTemplateSwitcher
            templateType={TransactionTypeEnum.Transfer}
          />
        }
      />
      {isLoading ? (
        <Loader />
      ) : (
        <TransferForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Submit"
          fromAccount={defaultTransferSourceAccount}
          toAccount={defaultTransferTargetAccount}
        />
      )}
    </>
  );
};
