'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import BackButton from '../../../../components/common/BackButton';
import { useLanguageStore } from '@/stores/useLanguageStore';
import * as i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';
import AlertModal from '../../../../components/common/AlertModal';
import { useAuthStore } from '@/stores/useAuthStore';

const langMap = {
  English: { code: 'en', langId: 'en' },
  Korean: { code: 'kr', langId: 'kr' },
  Japanese: { code: 'jp', langId: 'jp' },
  Chinese: { code: 'cn', langId: 'cn' }
} as const;

type LanguageKey = keyof typeof langMap;

export default function LanguagePage() {
  const [selected, setSelected] = useState<LanguageKey>('English');
  const { setLangId, setLangCode } = useLanguageStore();
  const { t } = useTranslation('translation');

  const [ready, setReady] = useState(false);

  // ✅ AlertModal 상태 추가
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', description: '' });

  useEffect(() => {
    const checkReady = () => setReady(true);

    if (i18n.default.isInitialized) {
      checkReady();
    } else {
      i18n.default.on('initialized', checkReady);
    }

    i18n.default.on('languageChanged', checkReady);

    return () => {
      i18n.default.off('initialized', checkReady);
      i18n.default.off('languageChanged', checkReady);
    };
  }, []);

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      const match = Object.entries(langMap).find(([, val]) => val.code === storedLang);
      if (match) setSelected(match[0] as LanguageKey);
    }
  }, []);

  const handleUpdate = async () => {
    const { code, langId } = langMap[selected];
    i18n.default.changeLanguage(code);
    localStorage.setItem('language', code);
    setLangId(langId);
    setLangCode(code);
  
    const memberIdx = useAuthStore.getState().member?.idx; // ✅ zustand에서 idx 가져오기
  
    if (!memberIdx) {
      setAlertContent({
        title: t('common.error', 'Error'),
        description: '회원 정보가 없습니다. 다시 로그인해주세요.',
      });
      setAlertOpen(true);
      return;
    }
  
    try {
      const res = await fetch('/api/member/setLang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_idx: memberIdx, LangId: langId.toUpperCase() }),
      });
  
      const data = await res.json();
  
      if (data.result !== '1') {
        setAlertContent({
          title: t('common.error', 'Error'),
          description: t('setting.language.updateFail', 'Failed to update language'),
        });
      } else {
        setAlertContent({
          title: t('common.success', 'Success'),
          description: t('setting.language.update', {
            lang: t(`language.${selected.toLowerCase()}`),
          }),
        });
      }
    } catch (err) {
      console.error('[Language API Error]', err);
      setAlertContent({
        title: t('common.error', 'Error'),
        description: '언어 변경 중 오류가 발생했습니다.',
      });
    }
  
    setAlertOpen(true);
  };
  

  if (!ready) return null;

  return (
    <div className="bg-white min-h-screen px-3 pt-5 pb-32 text-black relative max-w-[430px] mx-auto">
      <BackButton />
      <div className="text-[20px] font-bold leading-snug mt-2">
        {t('setting.language.content')}
      </div>

      <div className="mt-6 space-y-3 text-md">
        {Object.keys(langMap).map((lang) => {
          const typedLang = lang as LanguageKey;
          const isActive = selected === typedLang;
          return (
            <button
              key={lang}
              onClick={() => setSelected(typedLang)}
              className={`w-full border py-3 px-4 text-left rounded-xl flex justify-between items-center ${
                isActive ? 'border-[#FF8FA9]' : 'border-gray-200'
              }`}
            >
              <span className="font-medium">{t(`language.${typedLang.toLowerCase()}`)}</span>
              {isActive && (
                <div className="w-5 h-5 rounded-full bg-[#FF8FA9]  flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t max-w-[430px] mx-auto w-full">
        <button
          className="bg-[#FF8FA9]  text-white w-full rounded-xl py-3 font-semibold"
          onClick={handleUpdate}
        >
          {t('setting.language.update')}
        </button>
      </div>

      {/* ✅ AlertModal 삽입 */}
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertContent.title}
        description={alertContent.description}
        buttonText={t('common.confirm', 'OK')}
      />
    </div>
  );
}
