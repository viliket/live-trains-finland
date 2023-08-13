import type { AppProps } from 'next/app';

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
        <ServiceWorkerUpdatePrompt />
        <SwitchLanguage />
        <TopNavBar />
        <Component {...pageProps} />
      </div>
      <Footer />
    </Providers>
  );
}
