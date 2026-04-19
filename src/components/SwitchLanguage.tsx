'use client';
import { useEffect } from 'react';

import LanguageDetector from 'i18next-browser-languagedetector';

import i18n from '../i18n';

const SwitchLanguage = () => {
  useEffect(() => {
    // Deferred until after first render to keep SSR/hydration in fallbackLng.
    const detector = new LanguageDetector(i18n.services);
    const detected = detector.detect();
    const lng = Array.isArray(detected) ? detected[0] : detected;
    if (lng) i18n.changeLanguage(lng);
    i18n.services.languageDetector = detector;
  }, []);

  return null;
};

export default SwitchLanguage;
