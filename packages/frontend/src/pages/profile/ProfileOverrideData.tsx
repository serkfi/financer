/* eslint-disable consistent-return */
import { ChangeEvent, useEffect, useState } from 'react';

import { Button } from '../../components/button/button';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Heading } from '../../components/heading/heading';
import {
  Notification,
  INotificationProps,
} from '../../components/notification/notification';
import { SEO } from '../../components/seo/seo';
import { useOverrideProfileData } from '../../hooks/profile/useOverrideProfileData';
import { IOverrideProfileData } from '../../services/ProfileService';

export const ProfileOverrideData = (): JSX.Element => {
  const [uploadedUserData, setUploadedUserData] =
    useState<IOverrideProfileData | null>(null);
  const [overrideTranactionCount, setOverrideTranactionCount] = useState<
    number | null
  >(null);
  const [overrideAccountCount, setOverrideAccountCount] = useState<
    number | null
  >(null);
  const [overrideFilename, setOverrideFilename] = useState<string | null>(null);
  const [notification, setNotification] = useState<INotificationProps | null>(
    null
  );
  const overrideProfileData = useOverrideProfileData();

  useEffect(() => {
    if (!uploadedUserData) {
      setOverrideTranactionCount(null);
      setOverrideAccountCount(null);
      return;
    }

    setOverrideTranactionCount(uploadedUserData.transactions.length);
    setOverrideAccountCount(uploadedUserData.accounts.length);
  }, [uploadedUserData]);

  const handleResetNotification = () => {
    setNotification({
      type: 'success',
      label: '',
      children: '',
    });
  };

  const handleOverrideData = async () => {
    if (!uploadedUserData) {
      setNotification({
        type: 'error',
        label: 'Upload failed',
        children: 'Cannot update uploaded user data.',
      });
      return;
    }

    const override = await overrideProfileData(uploadedUserData);

    if (override.status < 300) {
      setNotification({
        type: 'success',
        label: 'Successfully overridden',
        children: override?.payload,
      });
    } else {
      setNotification({
        type: 'error',
        label: 'Overridde failed',
        children: override?.payload,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const { files } = changeEvent.target;
    const targetFile = files?.item(0);
    if (!targetFile) {
      setOverrideFilename(null);
      setUploadedUserData(null);
      setNotification({
        type: 'error',
        label: 'Upload failed',
        children: 'File not found',
      });
      return;
    }

    const fr = new FileReader();
    fr.onload = (readerEvent) => {
      if (
        readerEvent?.target?.result &&
        typeof readerEvent?.target?.result === 'string'
      ) {
        const result = JSON.parse(readerEvent.target.result);
        setUploadedUserData(result);
        setOverrideFilename(targetFile.name);
      } else {
        setNotification({
          type: 'error',
          label: 'Upload failed',
          children: 'Failed to parse JSON file',
        });
      }
    };
    fr.readAsText(targetFile);
  };

  return (
    <>
      <SEO title="Override data (DANGER ZONE)" />
      {notification && (
        <Notification
          type={notification.type}
          label={notification.label}
          resetNotification={handleResetNotification}
        >
          {notification.children}
        </Notification>
      )}
      <Heading variant="h1" className="mb-4 lg:mb-6">
        Override your data
      </Heading>
      <div>
        <label
          htmlFor="selectFiles"
          className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-blue-600 border border-transparent rounded-md sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-blue-500 active:bg-blue-700 focus:ring-blue-500"
        >
          Choose file
          <input
            className="hidden"
            type="file"
            id="selectFiles"
            onChange={handleFileChange}
            accept="application/json"
          />
        </label>
        <span className="ml-2">{overrideFilename || 'No file selected'}</span>
      </div>
      <DescriptionList label="Override data details" className="mt-6">
        <DescriptionListItem label="Account count">
          {overrideAccountCount ? `${overrideAccountCount}` : '-'}
        </DescriptionListItem>
        <DescriptionListItem label="Transaction count">
          {overrideTranactionCount ? `${overrideTranactionCount}` : '-'}
        </DescriptionListItem>
      </DescriptionList>

      <Button onClick={handleOverrideData} accentColor="red" className="mt-6">
        Override my data
      </Button>
    </>
  );
};