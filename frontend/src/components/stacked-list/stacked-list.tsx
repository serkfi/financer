import React from 'react';

import { StackedListBody } from './stacked-list.body';
import { StackedListHeader, TAddiotinalLabel } from './stacked-list.header';
import { StackedListRow, IStackedListRowProps } from './stacked-list.row';

interface IStackedListProps {
  addiotinalLabel?: TAddiotinalLabel;
  label?: string;
  rows: IStackedListRowProps[];
  rowTestId?: string;
}

export const StackedList = ({
  addiotinalLabel,
  label,
  rows,
  rowTestId,
}: IStackedListProps): JSX.Element => {
  if (label) {
    return (
      <div className="lg:flex items-start relative">
        <StackedListHeader label={label} addiotinalLabel={addiotinalLabel} />
        <StackedListBody>
          {rows.map(
            ({
              additionalInformation,
              additionalLabel,
              label: rowLabel,
              link,
              tags,
              id,
              actions,
            }) => (
              <StackedListRow
                label={rowLabel}
                additionalLabel={additionalLabel}
                additionalInformation={additionalInformation}
                link={link}
                tags={tags}
                actions={actions}
                id={id}
                key={id}
                testId={rowTestId}
              />
            )
          )}
        </StackedListBody>
      </div>
    );
  }

  return (
    <StackedListBody>
      {rows.map(
        ({
          additionalInformation,
          additionalLabel,
          label: rowLabel,
          link,
          tags,
          id,
          actions,
        }) => (
          <StackedListRow
            label={rowLabel}
            additionalLabel={additionalLabel}
            additionalInformation={additionalInformation}
            link={link}
            tags={tags}
            actions={actions}
            id={id}
            key={id}
            testId={rowTestId}
          />
        )
      )}
    </StackedListBody>
  );
};
