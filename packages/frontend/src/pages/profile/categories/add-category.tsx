import { CategoryForm } from './category-form';

import { CreateTransactionCategoryDto } from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface AddCategoryProps {
  errors: string[];
  isLoading: boolean;
  onSubmit: (newTransactionCategoryData: CreateTransactionCategoryDto) => void;
}

export const AddCategory = ({
  onSubmit,
  errors,
  isLoading,
}: AddCategoryProps): JSX.Element => {
  return (
    <Container>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add transaction category"
        backLink="/profile/transaction-categories"
      />
      <CategoryForm onSubmit={onSubmit} errors={errors} submitLabel="Add" />
    </Container>
  );
};