import { useState } from 'react';

import {
  CreateTransactionCategoryDto,
  useTransactionCategoriesCreateMutation,
} from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { CategoryAdd } from '$pages/settings/categories/category.add';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const CategoryAddContainer = () => {
  const { push } = useViewTransitionRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [addTransactionCategory, { isLoading: isCreating }] =
    useTransactionCategoriesCreateMutation();

  const handleSubmit = async (
    newTransactionCategoryData: CreateTransactionCategoryDto
  ) => {
    try {
      await addTransactionCategory({
        createTransactionCategoryDto: {
          ...newTransactionCategoryData,
          visibility: newTransactionCategoryData.visibility || [],
          parent_category_id:
            newTransactionCategoryData.parent_category_id || null,
        },
      }).unwrap();

      push(settingsPaths.categories);
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
    <CategoryAdd
      onSubmit={handleSubmit}
      errors={errors}
      isLoading={isCreating}
    />
  );
};