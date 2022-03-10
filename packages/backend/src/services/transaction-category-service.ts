import {
  transactionCategoryModel,
  ITransactionCategoryModel,
} from '../models/transaction-category-model';

export const findTransactionCategoriesByUser = async (
  userId: string
): Promise<ITransactionCategoryModel[] | null> =>
  transactionCategoryModel.find({
    owner: userId,
    deleted: { $ne: true },
  });

export const findTransactionCategoryById = async (
  id: string
): Promise<ITransactionCategoryModel | null> =>
  transactionCategoryModel.findOne({
    _id: id,
    deleted: { $ne: true },
  });

export const createTransactionCategory = async (
  newTransactionCategory: ITransactionCategoryModel
): Promise<ITransactionCategoryModel | null> =>
  transactionCategoryModel.create(newTransactionCategory);

export const createMultipleTransactionCategories = async (
  newTransactionCategories: ITransactionCategoryModel[]
): Promise<ITransactionCategoryModel[] | null> =>
  transactionCategoryModel.insertMany(newTransactionCategories);

export const markTransactionCategoryAsDeleted = async (
  id: string
): Promise<ITransactionCategoryModel | null> => {
  const transactionCategory = await findTransactionCategoryById(id);

  if (transactionCategory === null) return null;

  transactionCategory.deleted = true;

  return transactionCategory.save();
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DANGER_truncateTransactionCategoriesByUser = async (
  userId: string
): Promise<void> => {
  await transactionCategoryModel.deleteMany({ owner: userId });
};