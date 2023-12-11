import { SubmitHandler, useForm } from 'react-hook-form';

import { AccountType, AccountTypeEnum } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { Alert } from '$elements/alert/alert';
import { Input } from '$elements/input/input';
import { Select, Option } from '$elements/select/select';
import { capitalize } from '$utils/capitalize';

interface AccountFormProps {
  errors: string[];
  onSubmit: SubmitHandler<AccountFormFields>;
  submitLabel: string;
  initialValues?: Partial<AccountFormFields>;
}

export interface AccountFormFields {
  name: string;
  balance: number;
  type: AccountType;
}

export const AccountForm = ({
  errors,
  onSubmit,
  submitLabel,
  initialValues,
}: AccountFormProps): JSX.Element => {
  const methods = useForm<AccountFormFields>({
    defaultValues: { type: AccountTypeEnum.Savings, ...initialValues },
  });

  const accountTypes: Option[] = Object.values(AccountTypeEnum).map(
    (value) => ({
      value,
      label: capitalize(value),
    })
  );

  return (
    <>
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="form-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        methods={methods}
        submitLabel={submitLabel}
        onSubmit={onSubmit}
        formFooterBackLink="/accounts"
      >
        <section>
          <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input id="name" isRequired>
              Account
            </Input>
            <Input id="balance" type="number" step={0.01} isRequired>
              Balance
            </Input>
            <Select id="type" options={accountTypes} isRequired>
              Type
            </Select>
          </div>
        </section>
      </Form>
    </>
  );
};
