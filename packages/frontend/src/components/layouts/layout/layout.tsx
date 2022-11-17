import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { ReactComponent as Logo } from '../../../assets/logo.svg';
import { DesktopNavigation } from '../../blocks/desktop-navigation/desktop-navigation';
import { ErrorBoundaryHandler } from '../../blocks/error-boundary/error-boundary';
import { MobileNavigation } from '../../blocks/mobile-navigation/mobile-navigation';
import { LoaderSuspense } from '../../elements/loader/loader-suspense';
import { Container } from '../container/container';
import { DesktopHeader } from '../desktop-header/desktop-header';
import { MobileHeader } from '../mobile-header/mobile-header';

const OutletWithErrorBoundary = (): JSX.Element => (
  <ErrorBoundaryHandler errorPage="in-app">
    <LoaderSuspense>
      <Outlet />
    </LoaderSuspense>
  </ErrorBoundaryHandler>
);

export const Layout = (): JSX.Element => {
  const [currentWindowWidth, setCurrentWindowWidth] = useState(
    window.outerWidth
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const loadInitialWidth = (times = 0) => {
      if (window?.outerWidth) {
        setCurrentWindowWidth(window.outerWidth);
        return;
      } else if (times < 10) {
        timeout = setTimeout(loadInitialWidth, 50, times + 1);
      }
    };

    loadInitialWidth();

    return () => clearTimeout(timeout);
  }, []);

  window.addEventListener('resize', () =>
    setCurrentWindowWidth(window.outerWidth)
  );

  if (currentWindowWidth >= 1024) {
    return (
      <div className="bg-white">
        <Container className="grid grid-cols-[300px,1fr] min-h-screen px-0">
          <aside className="after:bg-gray after:ml-[-100vw] after:pr-[100vw] after:absolute after:top-0 after:bottom-0 after:right-0 relative border-r border-gray-dark">
            <div className="sticky top-0 z-10 min-h-screen pt-12 pb-12 pl-8 pr-4 bottom-12">
              <header>
                <NavLink to="/" className="inline-flex items-center gap-3 mb-8">
                  <Logo className="block w-auto h-10" />
                  <h2 className="text-2xl font-bold tracking-tight text-black">
                    Financer
                  </h2>
                </NavLink>
                <DesktopNavigation />
              </header>
            </div>
          </aside>
          <main>
            <div className="px-8 py-12" data-testid="layout-root">
              <DesktopHeader />
              <OutletWithErrorBoundary />
            </div>
          </main>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-screen overflow-y-scroll lg:hidden">
      <main className="flex-grow bg-white lg:pb-24 min-h-screen-safe pb-safe">
        <div className={`px-4 mt-[64px] pt-4 pb-24`} data-testid="layout-root">
          <OutletWithErrorBoundary />
        </div>
      </main>
      <header>
        <MobileHeader />
        <MobileNavigation />
      </header>
    </div>
  );
};