'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type ModalType = 'cancel' | 'cancel-free' | 'terms' | 'privacy' | 'ad';

interface SiteInfo {
  Terms_of_Use?: string;
  Privacy_Policy?: string;
}

export default function TermsModal({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ API 호출 (type이 terms 또는 privacy일 때만)
  useEffect(() => {
    if (type === 'terms' || type === 'privacy') {
      setLoading(true);
      fetch(`/api/siteInfo?LangId=${lang.toUpperCase()}`)
        .then((res) => res.json())
        .then((data) => setSiteInfo(data))
        .catch((err) => {
          console.error('사이트 정보 로드 실패:', err);
          setSiteInfo(null);
        })
        .finally(() => setLoading(false));
    }
  }, [lang, type]);

  // ✅ 다국어 문장 배열 (cancel, cancel-free, ad 전용)
  const contents: Record<'cancel' | 'cancel-free' | 'ad', string[]> = {
    cancel: [
      t('terms.cancel.1'),
      t('terms.cancel.2'),
      t('terms.cancel.3'),
    ],
    'cancel-free': [
      t('terms.cancel-free.1'),
      t('terms.cancel-free.2'),
      t('terms.cancel-free.3'),
    ],
    ad: [
      t('terms.ad.1'),
      t('terms.ad.2'),
    ],
  };

  const titles: Record<ModalType, string> = {
    cancel: t('terms.title.cancel', 'Cancellation Policy'),
    'cancel-free': t('terms.title.cancel', 'Cancellation Policy'),
    terms: t('terms.title.use', 'Terms of Use'),
    privacy: t('terms.title.privacy', 'Privacy Policy'),
    ad: t('terms.title.ad', 'Promotional Emails Agreement'),
  };

  const isStatic = type === 'cancel' || type === 'cancel-free' || type === 'ad';

  const htmlContent =
    type === 'terms'
      ? siteInfo?.Terms_of_Use
      : type === 'privacy'
      ? siteInfo?.Privacy_Policy
      : '';

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 transition-all duration-300 ease-in-out',
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      )}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div
        className={clsx(
          'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-w-[430px] mx-auto transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <h2 className="text-lg font-semibold mb-3">{titles[type]}</h2>

        {isStatic ? (
          <ul className="text-[16px] text-gray-700 space-y-2 max-h-[50vh] overflow-y-auto list-disc list-inside">
            {contents[type as 'cancel' | 'cancel-free' | 'ad'].map((text, idx) => (
              <li key={idx}>{text}</li>
            ))}
          </ul>
        ) : loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div
            className="text-[15px] text-gray-700 max-h-[50vh] overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
          />
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-lg bg-[#FF8FA9] text-white font-semibold"
        >
          {t('common.close', 'Close')}
        </button>
      </div>
    </div>
  );
}
