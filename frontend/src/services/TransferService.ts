export const getAllTransferTranscations = async (): Promise<
  IApiResponse<ITransaction[]>
> => {
  const transfers = await fetch('/api/transaction/transfers');
  return transfers.json();
};

export const getTransferById = async (id: string): Promise<ITransaction> => {
  const transfer = await fetch(`/api/transaction/${id}`);
  return (await transfer.json()).payload;
};

export const deleteTransfer = async (id: string): Promise<void> => {
  await fetch(`/api/transaction/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
