// language.ts
export const langMap = {
    English: { code: 'en', langId: 'en' },
    Korean: { code: 'kr', langId: 'kr' },
    Japanese: { code: 'jp', langId: 'jp' },
    Chinese: { code: 'cn', langId: 'cn' }
  } as const;
  
  export type LangKey = keyof typeof langMap;
  