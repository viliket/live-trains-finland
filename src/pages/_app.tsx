import type { AppProps } from 'next/app';
import Head from 'next/head';

import Footer from '../components/Footer';
import ServiceWorkerUpdatePrompt from '../components/ServiceWorkerUpdatePrompt';
import SwitchLanguage from '../components/SwitchLanguage';
import { TopNavBar } from '../components/TopNavBar';
import Providers from '../providers/Providers';

import '../App.css';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <div className="App" data-testid="app">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="#f9f9fb"
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="#1e1e1e"
          />
          <title>Junien aikataulut ja sijainnit | Junaan.fi</title>
          <meta
            name="description"
            content="Junien aikataulut, sijainnit, ja kokoonpanot reaaliajassa"
          />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <ServiceWorkerUpdatePrompt />
        <SwitchLanguage />
        <TopNavBar />
        <Component {...pageProps} />
      </div>
      <Footer />
    </Providers>
  );
}
