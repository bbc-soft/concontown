// src/i18n/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import kr from './locales/kr/translation.json';
import cn from './locales/cn/translation.json';
import jp from './locales/jp/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    kr: { translation: kr },
    cn: { translation: cn },
    jp: { translation: jp }
  },
  lng: 'jp', // 기본값만 설정
  fallbackLng: 'jp',
  interpolation: {
    escapeValue: false
  },
  initImmediate: false,
  defaultNS: 'translation'
});

export default i18n;
