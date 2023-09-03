import { ReactElement, ReactNode } from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { NextPage } from 'next/types';

import Footer from '../components/Footer';
import ServiceWorkerUpdatePrompt from '../components/ServiceWorkerUpdatePrompt';
import SwitchLanguage from '../components/SwitchLanguage';
import { TopNavBar } from '../components/TopNavBar';
import Providers from '../providers/Providers';

import '../App.css';
import 'maplibre-gl/dist/maplibre-gl.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Providers>
      <div className="App" data-testid="app">
        <Head>
          <title>Junien aikataulut ja sijainnit | Junaan.fi</title>
          <meta
            name="description"
            content="Junien aikataulut, sijainnit, ja kokoonpanot reaaliajassa"
          />
        </Head>
        <ServiceWorkerUpdatePrompt />
        <SwitchLanguage />
        <TopNavBar />
        {getLayout(<Component {...pageProps} />)}
      </div>
      <Footer />
    </Providers>
  );
}
