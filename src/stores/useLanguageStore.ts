// src/stores/useLanguageStore.ts

import { create } from 'zustand';

type LanguageState = {
  langId: string;     // API 요청용 (EN / KR / JP / CN)
  langCode: string;   // i18n용 (en / kr / jp / cn)
  setLangId: (id: string) => void;
  setLangCode: (code: string) => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  langId: 'JP',
  langCode: 'jp',
  setLangId: (id) => set({ langId: id }),
  setLangCode: (code) => set({ langCode: code })
}));
