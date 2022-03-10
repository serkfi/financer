import React from 'react';

interface ITableHeadItemProps {
  children?: string;
  isAction?: boolean;
}

export const TableHeadItem = ({
  children = '',
  isAction = false,
}: ITableHeadItemProps): JSX.Element => {
  if (isAction) {
    return <th className="px-6 py-3 bg-gray-50" aria-label="Actions" />;
  }

  return (
    <th
      className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider max-w-xs"
      aria-label={children}
    >
      {children}
    </th>
  );
};