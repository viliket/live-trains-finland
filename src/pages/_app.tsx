import { ReactElement, ReactNode } from 'react';

import { AppCacheProvider } from '@mui/material-nextjs/v16-pagesRouter';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { NextPage } from 'next/types';

import ServiceWorkerUpdatePrompt from '../components/ServiceWorkerUpdatePrompt';
import SwitchLanguage from '../components/SwitchLanguage';
import Providers from '../providers/Providers';

import 'maplibre-gl/dist/maplibre-gl.css';
import '../App.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App(props: AppPropsWithLayout) {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AppCacheProvider {...props}>
      <Providers>
        <div className="App" data-testid="app">
          <Head>
            <title>Junien aikataulut ja sijainnit | Junaan.fi</title>
            <meta
              name="description"
              content="Junien aikataulut, sijainnit, ja kokoonpanot reaaliajassa"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <ServiceWorkerUpdatePrompt />
          <SwitchLanguage />
          {getLayout(<Component {...pageProps} />)}
        </div>
      </Providers>
    </AppCacheProvider>
  );
}
