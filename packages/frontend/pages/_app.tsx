import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';

import { useAuthGetAuthenticationStatusQuery } from '$api/generated/financerApi';
import { ErrorBoundaryHandler } from '$blocks/error-boundary/error-boundary';
import { ChartDynamic } from '$elements/chart/chart.dynamic';
import { Loader } from '$elements/loader/loader';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { Notification } from '$elements/notification/notification';
import { Layout } from '$layouts/layout/layout';
import { Login } from '$pages/login/login';
import { ScrollToTop } from '$renderers/scroll-to-top/scroll-to-top';
import { SEO } from '$renderers/seo/seo';
import { PageInfoProvider } from 'src/context/pageInfoContext';
import { store } from 'src/redux/store';

import '../src/assets/tailwind.css';

const PUBLIC_ROUTES = ['/privacy-policy', '/issues-with-login'];

const App = ({ Component, pageProps }: AppProps) => {
  const { data: authenticationStatus, isLoading } =
    useAuthGetAuthenticationStatusQuery();
  const { push, pathname } = useRouter();

  const [isOnboardingVisible, setOnboardingVisible] = useState(false);

  useEffect(() => {
    if (
      !authenticationStatus?.authenticated ||
      authenticationStatus?.hasAccounts ||
      isOnboardingVisible
    ) {
      return;
    }

    setOnboardingVisible(true);
    push('/accounts/add');
  }, [push, isOnboardingVisible, authenticationStatus]);

  if (isLoading) return <Loader />;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const errors = authenticationStatus?.errors;
  const isAuthenticated = authenticationStatus?.authenticated;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return (
    <>
      <ChartDynamic />
      {errors && (
        <Notification type="error" label="Something went wrong!">
          {errors.join(' ') || ''}
        </Notification>
      )}
      {isOnboardingVisible && (
        <Notification type={'success'} label={'Welcome to Financer!'}>
          Please add your first account before you start tracking finances with
          Financer.
        </Notification>
      )}
      {isAuthenticated || isPublicRoute ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Login />
      )}
    </>
  );
};

const AppWrapper = (props: AppProps) => {
  return (
    <Provider store={store}>
      <ErrorBoundaryHandler errorPage="full-app">
        <LoaderSuspense>
          <PageInfoProvider>
            <SEO />
            <ScrollToTop />
            <App {...props} />
          </PageInfoProvider>
        </LoaderSuspense>
      </ErrorBoundaryHandler>
    </Provider>
  );
};

export default AppWrapper;