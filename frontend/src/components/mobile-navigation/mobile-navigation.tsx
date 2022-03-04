import { isIOSDevice } from '../../utils/isIOSDevice';
import { isStandaloneMode } from '../../utils/isStandaloneMode';

import { MobileNavigationActions } from './mobile-navigation.actions';
import { MobileNavigationItem } from './mobile-navigation.item';

export const MobileNavigation = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 w-full bg-white border-t">
      <nav aria-label="Main navigation in mobile viewmode.">
        <ul
          className={`grid grid-cols-5 relative ${
            isIOSDevice() && isStandaloneMode() ? 'pb-4' : ''
          }`}
        >
          <MobileNavigationItem
            label="Home"
            iconName="home"
            link="/"
            isExact
            type="standalone"
          />
          <MobileNavigationItem
            label="Statistics"
            iconName="chart-bar"
            link="/statistics"
            disallowedPathEndings={['add']}
            type="standalone"
          />
          <MobileNavigationActions />
          <MobileNavigationItem
            label="Accounts"
            iconName="view-grid"
            link="/accounts"
            type="standalone"
          />
          <MobileNavigationItem
            label="Profile"
            iconName="user-circle"
            link="/profile"
            type="standalone"
          />
        </ul>
      </nav>
    </div>
  );
};
