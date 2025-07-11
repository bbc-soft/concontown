// src/components/setting/LanguageInitializer.tsx

'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import i18n from '@/i18n/i18n';

export default function LanguageInitializer() {
  const { setLangCode, setLangId } = useLanguageStore();

  useEffect(() => {
    const langMap: Record<string, string> = {
      ko: 'kr',
      en: 'en',
      ja: 'jp',
      zh: 'cn'
    };

    const browserLang = typeof window !== 'undefined'
      ? navigator.language.split('-')[0]
      : 'jp';

    const storedLang = localStorage.getItem('language');
    const langCode = storedLang || langMap[browserLang] || 'jp';
    const langId = langCode.toUpperCase();

    localStorage.setItem('language', langCode);
    setLangCode(langCode);
    setLangId(langId);
    i18n.changeLanguage(langCode);
  }, []);

  return null;
}
