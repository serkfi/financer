import { NavLink } from 'react-router-dom';

import { isExternalLink } from '../button/button';
import { Icon, IconName } from '../icon/icon';

interface LinkListLinkProps {
  icon?: IconName;
  children: string;
  link: string;
  testId?: string;
  className?: string;
}

export const LinkListLink = ({
  icon,
  link,
  children,
  testId,
  className = '',
}: LinkListLinkProps): JSX.Element => {
  const linkClasses = `relative flex gap-4 items-center focus-within:bg-gray-200 hover:bg-gray-200 overflow-hidden pl-4 ${className}`;

  const linkContent = (
    <>
      {icon && (
        <Icon
          type={icon}
          className="stroke-black flex-shrink-0 pointer-events-none"
        />
      )}
      <span className="text-base flex justify-between font-semibold tracking-tight py-4 pr-4 after:h-[1px] after:w-full after:absolute after:bg-gray-200 after:bottom-0 group-last:after:hidden flex-1 overflow-hidden">
        <span className="truncate">{children}</span>
        <Icon
          type={'chevron-right'}
          className=" stroke-gray-300 flex-shrink-0 pointer-events-none"
        />
      </span>
    </>
  );

  return (
    <>
      {isExternalLink(link) ? (
        <a href={link} className={linkClasses} data-testid={testId}>
          {linkContent}
        </a>
      ) : (
        <NavLink to={link} className={linkClasses} data-testid={testId}>
          {linkContent}
        </NavLink>
      )}
    </>
  );
};
