import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AccountTypeEnum } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { settingsPaths } from '$constants/settings-paths';
import { Checkbox } from '$elements/checkbox/checkbox';
import { CheckboxGroup } from '$elements/checkbox/checkbox.group';
import { Heading } from '$elements/heading/heading';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Paragraph } from '$elements/paragraph/paragraph';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';

const allAccountTypes = Object.values(AccountTypeEnum);

export interface UserStatisticsSettingsFormFields {
  accountTypes: AccountTypeEnum[];
}

interface UserStatisticsSettingsProps {
  isLoading: boolean;
  isUpdating: boolean;
  data?: UserStatisticsSettingsFormFields;
  onSave: (data: UserStatisticsSettingsFormFields) => void;
}

export const UserStatisticsSettings = ({
  isLoading,
  isUpdating,
  data,
  onSave,
}: UserStatisticsSettingsProps): JSX.Element | null => {
  const methods = useForm<UserStatisticsSettingsFormFields>();

  useEffect(() => {
    methods.reset(data);
  }, [data, methods]);

  return (
    <>
      {isUpdating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Statistics settings"
        backLink={settingsPaths.userPreferences}
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <Form
          methods={methods}
          onSubmit={onSave}
          submitLabel="Save"
          formFooterBackLink={settingsPaths.userPreferences}
        >
          <section className="mb-4">
            <Heading className="mb-2">Account types</Heading>
            <Paragraph>
              Selected types will be calculated into statistics and graphs on
              the statistics page.
            </Paragraph>
          </section>
          <CheckboxGroup
            testId="statistics-account-checkboxes"
            className="-mx-4"
          >
            {allAccountTypes.map((type) => (
              <Checkbox
                key={type}
                id={type}
                label={capitalize(type)}
                value={type}
                name="accountTypes"
              />
            ))}
          </CheckboxGroup>
        </Form>
      )}
    </>
  );
};
