import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const runsOnServerSide = typeof window === 'undefined';

if (!runsOnServerSide) {
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  i18n.use(Backend);
}

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: runsOnServerSide
      ? {
          fi: {
            translation: require('../public/locales/fi/translation.json'),
          },
          en: {
            translation: require('../public/locales/en/translation.json'),
          },
        }
      : undefined,
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'fi',
    load: 'languageOnly',
    supportedLngs: ['en', 'fi'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
