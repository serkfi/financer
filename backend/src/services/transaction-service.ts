import transactionModel, {
  ITransactionModel,
} from "../models/transaction-model";

export const findIncomeTransactionsByUser = async (
  userId: string
): Promise<ITransactionModel[] | null> =>
  transactionModel.find({
    user: userId,
    toAccount: { $ne: undefined },
    fromAccount: { $eq: undefined },
  });

export const findExpenseTransactionsByUser = async (
  userId: string
): Promise<ITransactionModel[] | null> =>
  transactionModel.find({
    user: userId,
    fromAccount: { $ne: undefined },
    toAccount: { $eq: undefined },
  });

export const findTransactionById = async (
  id: string
): Promise<ITransactionModel | null> => transactionModel.findById(id);

export const createTransaction = async (
  newAccount: ITransactionModel
): Promise<ITransactionModel | null> => transactionModel.create(newAccount);
