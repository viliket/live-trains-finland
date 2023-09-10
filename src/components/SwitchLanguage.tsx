'use client';
import { useEffect } from 'react';

import LanguageDetector from 'i18next-browser-languagedetector';
import { useTranslation } from 'react-i18next';

const SwitchLanguage = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Work-around for SSG: Change to detected language only after the first render
    // to avoid hydration issues due to potential language mismatch on the first render.
    const languageDetector = new LanguageDetector(i18n.services);
    let detectedLanguages = languageDetector.detect();
    if (Array.isArray(detectedLanguages)) {
      detectedLanguages = detectedLanguages[0];
    }
    if (detectedLanguages) {
      i18n.changeLanguage(detectedLanguages);
      document.documentElement.lang = detectedLanguages;
    }
    i18n.services.languageDetector = languageDetector;
  }, [i18n]);

  return null;
};

export default SwitchLanguage;
