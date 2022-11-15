import { AccountType } from '@local/types';
import { useNavigate } from 'react-router-dom';

import { Form } from '../../../../components/blocks/form/form';
import { Checkbox } from '../../../../components/elements/checkbox/checkbox';
import { CheckboxGroup } from '../../../../components/elements/checkbox/checkbox.group';
import { Heading } from '../../../../components/elements/heading/heading';
import { UpdatePageInfo } from '../../../../components/renderers/seo/updatePageInfo';
import { useUserDashboardSettings } from '../../../../hooks/profile/user-preference/useDashboardSettings';
import { capitalize } from '../../../../utils/capitalize';

const allAccountTypes = Object.values(AccountType);

export const UserDashboardSettings = (): JSX.Element => {
  const navigate = useNavigate();
  const [dashboardSettings, setDashboardSettings] = useUserDashboardSettings();

  const { accountTypes } = dashboardSettings ?? {};

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await setDashboardSettings({
      accountTypes: allAccountTypes
        .map((type) => ({
          type,
          value: (
            event.target as unknown as {
              [key in AccountType]: HTMLInputElement;
            }
          )[type].checked,
        }))
        .filter(({ value }) => value)
        .map(({ type }) => type),
    });

    navigate('/profile/user-preferences');
  };

  return (
    <>
      <UpdatePageInfo
        title="Dashboard settings"
        backLink={'/profile/user-preferences'}
      />
      <Form
        handleSubmit={handleSave}
        submitLabel="Save"
        formFooterBackLink="/profile/user-preferences"
      >
        <Heading className="mb-4">Account types for stats and graph</Heading>
        <CheckboxGroup testId="dashboard-account-checkboxes">
          {allAccountTypes.map((type) => (
            <Checkbox
              key={type}
              id={type}
              label={capitalize(type)}
              checked={accountTypes?.some((item) => item === type)}
            />
          ))}
        </CheckboxGroup>
      </Form>
    </>
  );
};
