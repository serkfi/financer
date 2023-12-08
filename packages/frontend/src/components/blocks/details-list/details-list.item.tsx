import { Icon, IconName } from '$elements/icon/icon';

export type DetailsItem = {
  icon: IconName;
  label: string;
  description: string | React.ReactNode;
};

export const DetailsListItem = ({ icon, label, description }: DetailsItem) => {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-2 items-center">
      <dt className="inline-flex items-center gap-2 font-normal text-black/75">
        <Icon type={icon} />
        {label}
      </dt>
      <dd className="text-right truncate font-medium">{description}</dd>
    </div>
  );
};